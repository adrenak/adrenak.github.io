---
slug: univoice-easy-push-to-talk
title: UniVoice 4.3.0  Easy Push To Talk
date: 2025-04-22
tags: univoice, opensource
description: Push to talk saves bandwidth and gives your users more control. These new features save you time when implementing it.
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
published: yes
---

Push to Talk is a popular feature to:
* Give more control to users and allow their audio to be broadcasted only when they want
* Reduce CPU and bandwidth usage on both the client and the server
* Avoid excess chatter when connected to several peers as they'd all be transmitting audio without it

## Old approach using VoiceSettings
UniVoice provides a [VoiceSettings](https://adrenak.github.io/univoice/api/Adrenak.UniVoice.VoiceSettings.html?ref=vatsalambastha.com) class that allows a client to mute or deafen a peer. 

In theory, this can be used to create a push-to-talk feature. However this isn't as straightforward.

After modifying VoiceSettings, you need to call [SubmitVoiceSettings()](https://adrenak.github.io/univoice/api/Adrenak.UniVoice.IAudioClient-1.html?ref=vatsalambastha.com#Adrenak_UniVoice_IAudioClient_1_SubmitVoiceSettings) to sync it with the server. The server then makes sure that the audio you send to it doesn't get sent to anyone.

Usage would be like this:

```csharp
session.Client.YourVoiceSettings.deafenAll = true;
session.Client.SubmitVoiceSettings();
```

This isn't too bad, but there are a couple of limitations:

* Syncing the settings with the server takes a while, so it's not as instantaneous.
* The client still continues to send audio to the server, it's just that the server doesn't send it to anyone else which does leads to muting, but this consumes bandwidth on the client and uses the resources of the server.

## New approach using ClientSession
For this reason in version 4.3.0 two new properties have been added to the `ClientSession` class.

These are:

* InputEnabled
* OutputsEnabled

Setting `InputEnabled` to false would cause the `ClientSession` to simply ignore the audio that's being captured on the local device. This means the device doesn't consume CPU resources running any filters and doesn't send any audio data over the network, saving bandwidth.

Setting `OutputsEnabled` to false ignores any incoming audio from other peers. This can be used to mute others easily. However, this doesn't stop data from being received by the client which still consumes bandwidth. So use this when you need to mute incoming audio instantly and for a short amount of time. Otherwise `VoiceSettings` is better.

The commit with the code changes is [here](https://github.com/adrenak/univoice/commit/f6c31d656a102037b8a9cd0bde6d1cdad203d29c?ref=vatsalambastha.com).