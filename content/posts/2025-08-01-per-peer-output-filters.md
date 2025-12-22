---
slug: univoice-per-peer-output-filters
title: UniVoice 4.6.0  Per peer output filters
date: 2025-08-01

tags: univoice, opensource
description: Each connected peer now has their own filter list. This fixes an Opus decoding bug.
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
author: Vatsal Ambastha

published: yes
---

UniVoice 4.6.0 is out! The main change in this release is per-peer output filters (instead of global filters) which also fixes a bug. 

But before I get into it, there are a couple smaller changes that I'd like to go over:

### UniMic 3.3.0

UniVoice now uses UniMic 3.3.0. This was a major improvement that I posted about [in this post](?post=unimic-metater-thanks) 

### ClientSession<T> constructor enhancements

You no longer need to implement an `IAudioOutputFactory` the client session object which can now be constructed using a factory method instead

```csharp
// This required you to create a StreamedAudioSourceOutput.Factory class that implements IAudioOutputFactory
// even though it doesn't do much, it just implements Create() that returns a new object
ClientSession = new ClientSession<int>(
  client, 
  input, 
  new StreamedAudioSourceOutput.Factory()
);

// But you you can do this. No need to create the Factory class
ClientSession = new ClientSession<int>(
  client, 
  input, () => new StreamedAudioSourceOutput()
);
```

Probably only useful if you're making your own `IAudioOutput` implementations.

Regardless of what you use, `ClientSession` understands if you're using a factory object or a method and handles it internally.

This brings me to the main change in this release. 

## Per peer output filter

### Investigation

I started the post about [UniMic 3.3.0](?post=unimic-metater-thanks) with the description of an issue.

When two people are in voice chat, the audio is clear. But as soon as a third person joins, the audio degrades substantially for all users and the voice is crackly. 

I have been looking into that issue for over a month. In fact, the improvements that UniMic 3.3.0 introduced were initially me trying to fix this problem. 

Around the same time that post went up, Github user [@FilipBarva](https://www.github.com/filipbarva?ref=vatsalambastha.com) opened an issue titled "[Robotic voices with more than two clients](https://github.com/adrenak/univoice/issues/49?ref=vatsalambastha.com)" which sounded like the root cause was the same.

Turns out the issue is that the Concentus objects, such as decoder, encoder and resampler cannot be shared for the audio of different peers. This is because they probably have some mutable data inside that's based on what they previously processed. 

A while ago I posted this [sample concentus test script](https://gist.github.com/adrenak/f05b269e46dd3bdc93d3a7b162813d45?ref=vatsalambastha.com). It basically does these things (in sequence)- starts the mic and captures the audio frames- resamples the audio to the desired frequency using Concentus, if required- encodes the audio - decodes the audio- plays it back.

You can attach that script to a gameobject, assemble some components in the inspector that it needs and it'll work. You can do this with multiple gameobjects and they will work in parallel.

I had a suspicion that using the same Concentus objects might lead to problems. So I did something pretty simple, I marked the Concentus objects static so that all instances of this script use the same objects.

```
static IOpusEncoder encoder;
static IOpusDecoder decoder;
static IResampler resampler;
```

And suddenly, the multiple gameobjects that were previously working perfectly in parallel were not sounding so good. The audio had crackles and pops.

### Bug

Before this release, the `ClientSession` class had a single `List<IAudioFilter> OutputFilters`. You can see this in the 4.5.1 release [here](https://github.com/adrenak/univoice/blob/acc27a96c1e35920f12196899c97d3a59a6e654b/Assets/Adrenak.UniVoice/Runtime/ClientSession.cs?ref=vatsalambastha.com#L45) and the usage [here](https://github.com/adrenak/univoice/blob/acc27a96c1e35920f12196899c97d3a59a6e654b/Assets/Adrenak.UniVoice/Samples/Basic%20Setup%20Scripts/UniVoiceMirrorSetupSample.cs?ref=vatsalambastha.com#L188).

Basically to add an output filter, you create the filter object and add it to the list.

But this is exactly what was wrong. Internally `ClientSession` iterated over the same output filters over the audio of every peer. This meant the filters were being shared for different audio streams. 

### Fix
See the [4.6.0 commit](https://github.com/adrenak/univoice/commit/a05c2f5734656984643f9523cd5442338946157c?ref=vatsalambastha.com)

To fix this, instead of creating and add the filter objects to the `ClientSession`, you register a lambda that creates and returns the filter object.

This lambda can then be executed for every peer, allowing the session to internally maintain a `Dictionary<T, List<IAudioFIlter>>` which is a map of every filter for every peer.

The adding and removal of output filters is using using: `.AddOutputFilter` and `.RemoveOutputFilter`.

The usage looks like this:

`ClientSession.AddOutputFilter<ConcentusDecodeFilter>(() => new ConcentusDecodeFilter());`

`ClientSession.RemoveOutputFilter<ConcentusDecodeFilter>();`

You can also check if an output filter type has already been added using 

`ClientSession.HasOutputFilter<ConcentusDecodeFilter>();`

The previous usage has been deprecated. Using `ClientSession.OutputFilters.Add(new ConcentusDecodeFilter());` will now lead to an error that says you should use the new methods. So this release does have some breaking changes.