---
slug: univoice-fishnet-support
title: UniVoice 4.8.0  FishNet support
date: 2025-09-04
tags: univoice, opensource
description: UniVoice has early FishNet support, consider it in beta. Thanks to Frantisek Holubec for the contribution!
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
published: yes
---

UniVoice 4.8.0 is out!

The key change is that FishNetworking is now finally supported. Huge thanks to [@FrantisekHolubec](https://github.com/FrantisekHolubec?ref=vatsalambastha.com) for this [code contribution](https://github.com/adrenak/univoice/commit/fdc3424180d8991c92b3e092b3edb50b6110c863?ref=vatsalambastha.com)

## Technical details

Looking at the commit, you will see that the FishNet code is very similar to the Mirror implementation. This is not an accident as FishNet has always tried to position itself as a Mirror++ and has many similarities.

Honestly, I like the FishNet APIs a lot more. It's cleaner, has events for everything that was required, and unlike Mirror it didn't need any hacks to get working.

A setup sample script has also been made available along with a sample scene that you can simply build and run and get a basic voice chat working.

Look around the [samples](https://github.com/adrenak/univoice/tree/d0bbcfcfef84fa2e114c97db2dfec22984a4e9ea/Assets/Adrenak.UniVoice/Samples/Basic%20Setup%20Scripts?ref=vatsalambastha.com) and you will realize that the FishNet and Mirror setup scripts are absolutely identical, except for two lines where we construct client and server objects.

## Thoughts

Looking at the FishNet implementation/support scripts, it becomes really obvious that there's a lot of code duplication between Mirror and FishNet.

Part of me wants to address it. By moving code into a single place, the implementation would also get simpler.

However, first, I will wait for at least one more network implementation before I think of doing something like that. The next is Netcode. I already have a somewhat working code for it, and hope it'll be released some time this month.

Second, I already have a couple of other quality features like proximity voice, voice activity detection, and most importantly acoustic echo cancellation that I would rather focus on.

Third, it's not just a matter of moving some code into a base class or utilities. I look at things like the binary writer and reader, and I feel that they should be opened up for user defined payload. Or that an install wizard would make it much easier to set up and modify UniVoice in a project.

So, refactors are not exactly on my mind right now. Version 4.x is all about reaching a set of highly desirable features. 