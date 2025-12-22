---
slug: univoice-simple-vad
title: UniVoice 4.10.0 SimpleVadFilter
date: 2025-10-23
tags: univoice, opensource
description: Simple Voice Activity Detection to reduce bandwidth usage.
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
published: yes
---

UniVoice hasn't had any VAD (Voice Activity Detection) so far. So unless you're using Push to Talk (see [this article](?post=univoice-easy-push-to-talk) on how to use it in UniVoice), your client is constantly transmitting silent audio over the network.

This definitely adds a lot to bandwidth usage. Consider a scenario where two people talk for 1 minute. Assuming they don't talk over each other, together they will end up sending at least 1 minute of silence over the network.

Make that 3 people, and you have 2 minutes of silence being sent over the network.

I'm not 100% sure but I think that Opus does compress silence more compared to audio with voice. However this is still a big waste of bandwidth.

## SimpleVad
There are better VAD solutions out there, but they're C++ code that I need to build. For now I have a plain C# solution. I've had a help from ChatGPT making this, but after a day of testing, tweaking and modifying the code I've finally reached something I'm happy with.

An `IAudioFilter` implementation called `SimpleVadFilter` in `SimpleVad.cs` has been added in UniVoice 4.10.0

The usage is really simple, you just add a filter to outgoing audio like this:

`ClientSession.InputFilters.Add(new SimpleVadFilter(new SimpleVad()));`

It's probably better to add this filter after RNNoiseFilter so VAD is processing audio with less background noise and more voice.

You can create `new SimpleVad()` with no parameters, or pass a `SimpleVad.Configobject` in the constructor. See the [API reference for SimpleVad.Config](https://adrenak.github.io/univoice/api/Adrenak.UniVoice.SimpleVad.Config.html?ref=vatsalambastha.com) for more info.

## SimpleVadFilter
As I said, much of this code is written by ChatGPT, but it's pretty easy to understand. Here is an explainer for how the algorithm works (this too is AI generated)

### Config
🎚️ **Frame Length**
Defines how often we evaluate speech.
20 ms is common for low-latency audio pipelines.

⚡ **Attack / Release**
Time-based smoothing that prevents jittery on/off behavior.

* AttackMs: how long sustained speech must last to trigger speaking.
* ReleaseMs: how long silence must persist before flipping off.

🔊 **SNR Thresholds**
Two thresholds create hysteresis:

* SnrEnterDb (e.g., 10 dB): harder to start speaking.
* SnrExitDb (e.g., 4 dB): easier to stay speaking once started.

This asymmetry prevents flicker when the signal hovers near the boundary.

🪟 **Grace Periods**
* MaxGapMs allows brief quiet moments (pauses between words) while still treating it as speech.
* NoDropWindowMs ensures that once speech starts, it won’t instantly cut off.

🔉 **Noise Floor**
An exponentially moving average (EMA) tracks background noise:

* Updates faster when silent (to adapt quickly),
* Slower during speech (to avoid raising the floor).

### Algorithm
The main processing happens in ProcessOneFrame()

1️⃣ **Compute RMS Energy**
Each frame’s RMS (root mean square) gives a measure of loudness:

`rms = sqrt(sum(s²) / N)`

It’s clamped to a minimum `EnergyFloor` to avoid log(0) issues.

2️⃣ **Compute SNR in dB**
We compare the frame’s energy to the running noise estimate:

`snrDb = 20 * log10(rms / noise)`

A high SNR means the signal is louder than background noise — likely speech.

3️⃣ **Apply Threshold and Hysteresis**
Depending on whether we’re currently speaking:

```csharp
threshold = IsSpeaking ? SnrExitDb : SnrEnterDb;
bool rawSpeech = snrDb >= threshold;
```

This gives us an initial speech/silence decision per frame.

4️⃣ **Update Noise Floor**
Noise floor adapts using an exponential moving average:

```csharp
alpha = rawSpeech ? MaxNoiseUpdateRate : NoiseUpdateRate;
_noiseRms = (1 - alpha) * _noiseRms + alpha * rms;
```

That means noise updates quickly when we’re quiet, but very slowly when we’re talking — preventing voice from polluting the background estimate.

5️⃣ **Gap Handling**
If we’re in the “speaking” state but detect brief quiet periods:

```csharp
if (IsSpeaking) {
    if (rawSpeech) _gapMs = 0;
    else _gapMs += frameDurationMs;
}
```

As long as `_gapMs` stays below `MaxGapMs`, we still treat it as continuous speech.

6️⃣ **Time-Based Decision Logic**
Attack, release, and no-drop timers smooth transitions:

```csharp
if (!IsSpeaking && _speechMs >= AttackMs)
    newIsSpeaking = true;

if (IsSpeaking && _silenceMs >= ReleaseMs && _sinceOnsetMs >= NoDropWindowMs)
    newIsSpeaking = false;
```

This means:

* We only start speaking after continuous speech.
* We only stop speaking after sustained silence.

## Some thoughts
There is still one small limitation to this.

SimpleVad requires, say, 20ms of voice before it turns on. This means that in VAD mode when you start speaking, the first 20ms of your voice will not be transmitted.

I need to work on a way to allow `IAudioFilter` to either return multiple `AudioFrame` objects or return the `AudioFrame` with a longer samples array.

But still, I'm pretty happy with the results. As always, I look forward to your feedback. [Click here to join the Discord server](https://discord.com/invite/Tnf9KG93MC?ref=vatsalambastha.com)