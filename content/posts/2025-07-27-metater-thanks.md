---
slug: unimic-metater-thanks
title: UniMic 3.3.0  StreamedAudioSource improvements, thanks to Metater@github
date: 2025-07-27
tags: univoice, unimic, opensource
description: Updates to UniMic that makes playback of real-time streaming audio much better.
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
published: yes
---

For a couple of months, I have been getting on a weekly call with a team that's integrating UniVoice into a project but they've been facing an issue.

When it's just 2 people in the room, they can hear each other perfectly. But as soon as a third person joins, everyone's audio starts popping and gets a little jittery. You can still understand the person but the audio becomes noisy and irritating after a while.

The popping effect is often the cause of writing audio data to an AudioClip on a buffer strip that's still being read. Or it can happen when you write data that's too close to your reading head and before the writing operation completes the read head is already on it.

I've been looking into `StreamedAudioSource.cs` to fix a fix for this. But it was only last week that we finally figured out that the issue is in the Concentus Decode Filter instead and I've been looking in the wrong place. 

But the great thing about this detour is that during this time I've come across how other people are buffering and playing streaming audio. And one of them that does it really well is [MetaVoiceChat by Metater](https://github.com/Metater/MetaVoiceChat?ref=vatsalambastha.com).

## MetaVoiceChat
The [audio playback](https://github.com/Metater/MetaVoiceChat/blob/main/Output/AudioSource/VcAudioSourceOutput.cs?ref=vatsalambastha.com) code in this repository has some abilities I've been wanting to add to `StreamedAudioSource` for the longest time:

* Better control over buffering
* Handling network latency fluctuations
* Preventing looping audio

I used `MetaVoiceChat` to make changes to the `StreamedAudioSource` class and these new features are in `unimic@3.3.0` now 

Here's what's been introduced.

### Buffer Controls
Previously you configured buffering using `FrameCountForPlay` and `BufferFactor`. Both of which are pretty confusing. The frame length could be 5ms or 60ms, how am I supposed to configure `FrameCountForPlay`?

Now you just set a `targetLatency`. Suppose it's set to 0.25 seconds. This means the system will accumulate 250ms of audio before starting playback. The `targetLatency` here is the latency introduced as a result of buffering and is the delay we try to maintain between reception and playback.

### Handling Latency Fluctuations
But there's another kind of latency: the delay between transmission and reception.

The transmitting device is sending 1 second of audio every second, be it in chunks of 5ms or 20ms or 60ms. That audio goes over the network to the receiving device which is where network latency is introduced.

In an ideal situation, the network latency will remain constant. If the network latency is 200ms, the receiving device will receive audio in chunks every 200ms. Regardless of chunk size, the receiving device will end up with 1 second of audio every second. The transmission and reception are both in sync with a 200ms delay.

Fluctuations in the network latency means that we don't receive necessarily receive 1 second of audio every second. When the latency increases, we may receive only 900ms of audio in a second. If the latency reduces, we might receive 1100ms.

The `targetLatency` acts as a baseline for playback speed adjustment here. 

We try to keep the gap between the amount of audio in the buffer and the position of playback at `targetLatency`.

If we receive audio at less that real-time, say, 900ms of audio over the last 1 second. The gap here will shrink because the playback is faster than the buffer write speed. We react to this by reducing the speed of the playback to increase the gap towards `targetLatency`.

Similarly, if we receive audio faster than real-time, the gap here would increase. We try to decrease the gap by speeding up the playback.

The speeding up and slowing down of audio is done using a change in pitch. So it does mean the voice will get higher or deeper based on network fluctuations. But this way of handling latency fluctuations is pretty standard and the extent to which the pitch can be change and how fast the pitch changes are both configurable. 

### Frame Lifetime
I don't think I did any frame expiry before. This could lead to times where a short part of the audio buffer could play repeatedly on a loop.

MetaVoiceChat's code uses a `frameLifetime` that allows the system to know when the audio gets outdated and doesn't play.

## UniVoice support
At the time of writing, UniVoice 4.5.1 which is the latest version with the [newly released Mirror Host mode support](?post=mirror-host-mode-support) used UniMic 3.2.4

I'll be releasing a 4.6.0 that upgrades the dependency to 3.3.0 and UniVoice users should benefit from these latest improvements.

## Closing thoughts
MetaVoiceChat does a really great job with audio playback, and I'm glad that the creator Metater was kind enough to give me some tips over Discord.

This is one of the best things about open source software. There are things of mine that Metater has found helpful and vice-versa. It's back and forth, seeing what other people are doing, often collaborating and trying to create things for everyone to use.

Do [check out MetaVoiceChat here](https://github.com/Metater/MetaVoiceChat?ref=vatsalambastha.com). Something a lot of people may like about it is that unlike UniVoice, it's very MonoBehaviour friendly and configuration is possible in the inspector instead of via code.