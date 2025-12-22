---
slug: univoice-mono-repo
title: UniVoice is now (almost) a mono repo
date: 2025-03-13
tags: univoice, opensource
description: All those separate repos were really slowing everyone down. A few things still exist in separate repos.
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
published: yes
---

UniVoice has been around since Jan 2019 and has been evolving towards becoming a robust VoIP solution for Unity. Recently I released version 4.x, which is a big upgrade from v3. One of the things that's changed is that UniVoice is now a mono repo.

## Why mono repo?
Previously the main repository only housed the interfaces and implementations for them were [separate repositories](https://github.com/adrenak?tab=repositories&q=univoice&type=&language=&sort=&ref=vatsalambastha.com).

This caused a lot of pain for both me and any users of UniVoice.

For me because if I wanted to change something in, let's say, the [univoice-unimic-input repository](https://github.com/adrenak/univoice-unimic-input?ref=vatsalambastha.com). I would need to open UniVoice, change the manifest to point to a local copy of the univoice-unimic-input repo so that I can test the changes locally. 

For users because when they'd install the univoice package, it wouldn't really have anything usable. They'd need to install implementation packages separately. In v3, to get UniVoice to work you needed at implementations of at least three interfaces: `IAudioInput`, `IAudioOutput` and `IChatroomNetwork`.

This isn't readily obvious. The first reason is that there just isn't enough documentation (something I'll be working on soon). The second is that unless you know how UniVoice works or examine the inner workings of a sample project (again a separate repository), you probably wouldn't know UniVoice mainly works using those three interfaces.

So simplification and ease of maintenance were the major motivations for moving all the implementations to the main repository. 

## Inbuilt implementations 
Instead of importing packages of implementations, the implementations are now included in the main repository. You can find them [here](https://github.com/adrenak/univoice/tree/master/Assets/Adrenak.UniVoice/Runtime/Impl?ref=vatsalambastha.com).

Working out of the box
First, UniVoice now has package [dependencies](https://github.com/adrenak/univoice/blob/d76d964e55ab2f8f70efad05bd3f2d1bfc1161e8/Assets/Adrenak.UniVoice/package.json?ref=vatsalambastha.com#L34). They include 

* [brw](https://github.com/adrenak/brw?ref=vatsalambastha.com) the binary reader and writer for network messages
* [unimic](https://github.com/adrenak/unimic?ref=vatsalambastha.com) for easily reading Microphone data at runtime. 
* [concentus-unity](https://github.com/adrenak/concentus-unity?ref=vatsalambastha.com) which is a pure C# port of Opus for encoding and decoding audio.
Worth noting is that all the above dependencies are pure C# and themselves only dependent on Unity or standard C#.

Using the dependencies above, the following implementations have been written and included in the univoice package out of the box:

* [StreamedAudioSourceOutput](https://github.com/adrenak/univoice/blob/master/Assets/Adrenak.UniVoice/Runtime/Impl/Outputs/StreamedAudioSourceOutput.cs?ref=vatsalambastha.com) that implements IAudioOutput to play peer audio. Note that this uses StreamedAudioOutput, which is included in unimic.
* [UniMicInput](https://github.com/adrenak/univoice/blob/master/Assets/Adrenak.UniVoice/Runtime/Impl/Inputs/UniMicInput.cs?ref=vatsalambastha.com) that implements IAudioInput to capture microphone input for sending. This uses the Mic class in unimic
* [Concentus](https://github.com/adrenak/univoice/tree/master/Assets/Adrenak.UniVoice/Runtime/Impl/Filters/Concentus%20Opus%20Filters?ref=vatsalambastha.com) Filters that implement IAudioFilter for encoding and decoding audio. This uses concentus-unity

## Requiring some setup
UniVoice can also have inbuilt implementations that depend on code that's not included as a package dependencies. Right now, this is the [Mirror network implementation](https://github.com/adrenak/univoice/tree/master/Assets/Adrenak.UniVoice/Runtime/Impl/Networks/Mirror?ref=vatsalambastha.com).

Observe that each file uses the compilation symbol `UNIVOICE_MIRROR_NETWORK`.

The reason for this is that univoice doesn't include Mirror by default. So if you want voice chat in a Mirror game, you have to import Mirror and add that compilation symbol.

All future network implementations, let's say FishNet, Netcode would be added as inbuilt implementations this way. You'd need the supported network solution in your project and add a compilation symbol.

Note that the Mirror implementation also uses brw, which is a package dependency as mentioned above. Chances are all future network implementations would use it to read and write network messages.

## What this means
Say you want an implementation that depends on external code. Let's say it's an `IAudioFilter` for removing noise from mic input before sending it.

You have a package called com.denoise which has some native library for removing noise from audio data. You add it to your `manifest.json` as a dependency. Then write DenoiseFilter which would be an implementation of `IAudioFilter` which uses the code in com.denoise to achieve the filter's capabilities.