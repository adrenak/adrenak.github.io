---
slug: univoice-client-tags-2
title: UniVoice 4.11.0. Client tags fixes and samples
date: 2026-01-15
tags: opensource, univoice
description: I released something broken which I have now fixed. And created a sample to further make up for it.
published: yes
---

## Summary
* UniVoice 4.11.0 is out
* Tags are now sent as `string[]` which was added to [com.adrenak.brw@1.2.0](https://github.com/adrenak/brw/commit/cbce88b61aca69c0c9025cc6301973204612ded9)
* [`IAudioClient<T>.UpdateVoiceSettings`](https://vatsalambastha.com/univoice/api/Adrenak.UniVoice.IAudioClient-1.html#Adrenak_UniVoice_IAudioClient_1_UpdateVoiceSettings_System_Action_Adrenak_UniVoice_VoiceSettings__) method added to easily update voice settings.
* Convenience methods added to `VoiceSettings` to easily add, remove and set my tags, muted tags and deafened tags
* Tags sample added to demonstrate a team vs team voice chat scenario

## Description
The commit can be found [here](https://github.com/adrenak/univoice/commit/5db765929722f2e34bb464bcba48a459278de432#diff-dccef66643acdd469f44cf6de3acc82e7a509b707f47a4f4853ef28347d0420a)
  
`FishNetClient`, `FishNetServer`, `MirrorClient` and `MirrorServer` changed the way clients send and server reads the tags. I had tried something previously, and a developer later reported to me that tags were not being exchanged correctly. While I don't remember the issue exactly, I decided to add string array reading and writing to BRW and use that instead.

`IAudioClient<T>.UpdateVoiceSettings` has been added because it's just really annoying to have to remember calling `SubmitVoiceSettings` after every modification. It also makes things more verbose than they need to in many circumstances. Consider [the tags sample](https://github.com/adrenak/univoice/blob/5db765929722f2e34bb464bcba48a459278de432/Assets/Adrenak.UniVoice/Samples/Tags%20Sample/FishnetTagsSample.cs#L15) script. Each of those listeners would look something like this:

```csharp
x => {
  UniVoiceFishNetSetupSample.ClientSession.Client.YourVoiceSettings.SetMyTag("red", x);
  UniVoiceFishNetSetupSample.ClientSession.Client.SubmitVoiceSettings();
}
```

As far as convenience methods go, I had written in [the client tags annoucement post](?post=univoice-client-tags) that I will add some API enhancements to `VoiceSettings`, and 4.11.0 adds methods that allow you to set, add and remove tags instead of modifying the tag list directly. 

And finally, I've added tags samples. It creates a barebones team vs team voice chat environment. Run on two clients, on one set My Tags to Red and on the other set it to Blue.
On the Red client, mute and deafen Blue. And on Blue client, mute and deafen Red. This ensures that members of the red team can neither hear nor speak to blue team, and vice versa.

## Closing thoughts
I have a feeling tags is done for now. I don't see myself many any big changes or improvements at least in the 4.x cycle. But let me know if you face any issues. 

<br>

[![Join UniVoice Discord](https://img.shields.io/badge/Join%20UniVoice%20Discord-7289DA?logoColor=white&style=for-the-badge)](https://discord.com/invite/Tnf9KG93MC)
[![UniVoice on Github](https://img.shields.io/badge/UniVoice%20On%20Github-ffc400?logoColor=white&style=for-the-badge)](https://www.github.com/adrenak/univoice)
[![Contact via email](https://img.shields.io/badge/Contact%20Via%20Email-ad3723?logoColor=white&style=for-the-badge)](mailto:ambastha.vatsal@gmail.com)