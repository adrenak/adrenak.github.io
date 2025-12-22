---
slug: univoice-wavfilewriter
title: UniVoice 4.9.0  WavFileWriter and plans for recording features
date: 2025-09-17
tags: univoice, opensource
description: Write streaming audio to .wav files. More advanced features to come!
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
published: yes
---

UniVoice 4.9.0 is out, this is a small release which will build up to a large feature set in the future that I want to talk about in this post.

This version just introduces a utility class named `WavFileWriter.cs` which allows you to feed it real-time audio and when done it will write it to a .wav file

## Future Plans

As you might guess, this can be implemented in an `IAudioFilter`, and registered as an input or output filter to record incoming or outgoing audio from any client/peer.

With some more work, my hope it to create a somewhat high level feature called Recordings that will be an API to record voice data. Writing per-peer audio to individual wav files is definitely going to be supported from the very beginning. But I'm also hoping to make it possible to record and save the entire room data in a single file by merging them at runtime.

The plan is to allow quickly configuring UniVoice at a very high level to easily enable recordings, which might look like just setting something to true. 

But I also want to give developers the ability to code things at a lower level where you're maybe creating your own filter implementation and achieving the behaviour you want.

## Use cases

An example use-case of this would be storing timestamped meeting recordings on the server that is allowing clients to connect and talk. Since recording can also be per peer, you can the merged as well as individual client audio saved!

Similarly, it can also be used to implement a recording feature on the client. You press a button to enable recording and press it again to finish.