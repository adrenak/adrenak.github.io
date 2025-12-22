---
slug: univoice-client-tags
title: UniVoice 4.7.0  Client Tags
date: 2025-08-11
tags: univoice, opensource
description: Create chat groups within a chatroom easily. E.g. team voice chat in a 5v5 game
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
published: yes
---

> ⚠️ A bug was discovered with Client Tags, this feature is not stable and using it is not recommended. Once identified and fixed, this article will be updated.

UniVoice 4.7.0 has been released and has a major new feature: Client Tags

## Overview
Last year, a team using UniVoice had a question. They had 3 scenes in their Unity app that users could travel between. The app used non positional audio. But they didn't want people in two different scenes to be able to hear or speak to each other.

Consider a VR talent show application with a performer, audience and judges. The judges should be able to hear the speaker and talk to each other, but the speaker should not hear the judges. The audience should be able to listen to the performer. And maybe the performer should be able to hear the audience (applause, cheers, etc)

Similarly, for 5v5 game with a "red" and a "blue" team, I would have to make sure only people on the same team can hear each other so that they can discuss strategies privately.

## VoiceSettings until 4.6.0
Until version 4.6.0 [VoiceSettings](https://github.com/adrenak/univoice/blob/6760fb01a69c28e6bdda0800a54854a35e935037/Assets/Adrenak.UniVoice/Runtime/Types/VoiceSettings.cs?ref=vatsalambastha.com) only allowed to define the following:

* `muteAll : bool`
* `mutedPeers : List<int>`
* `deafenAll : List<int>`
* `deafenedPeers : List<int>`

Consider the example of the 3 scenes unity app I mentioned above. If you wanted to use those 4 fields to limit voice chat based on the scene they're in, a client would need to know which peer is in which room to add to `deafenedPeers`.

Doing this would require you to write some custom networking code. Maybe a synchronized variable that the server updates. Or some RPCs. There are many ways to do this but it would never be seamless.

The 4 fields above are suitable for only simple scenarios, such as a group voice call app. As soon as you need to group people together based on some criteria, it gets too cumbersome.

Since the `VoiceSettings` of all peers is stored on the server, so you could write some server code. But one of the core goals of UniVoice is to be very easy to integrate. As soon as you're having to write server code that's unrelated to gameplay UniVoice starts to become increasingly intrusive.

Basically, creating voice groups was really frustrating. If only there was a better way.

## VoiceSettings introduces Tags in 4.7.0
In [version 4.7.0](https://github.com/adrenak/univoice/blob/05f04805be09362b2d56050ad0668d0f687811fa/Assets/Adrenak.UniVoice/Runtime/Types/VoiceSettings.cs?ref=vatsalambastha.com), some new fields are introduced

* `myTags : List<string>`
* `mutedTags : List<string>`
* `deafenedTags : List<string>`

Each client gets to add a `List<string>` tags that it wants to be associated with.\ `.mutedTags` and `.deafenedTags` allow you to define the tags you don't want send you audio or receiving your audio.

For the 3 scene unity app example, let's say the scenes are "Lobby", "Waiting Room" and "Match".

Using the tags feature, you can program your client code such that when you enter the Lobby, you set `myTags = {"lobby"}` and `mutedTags = deafenedTags = {"waiting-room", "match"}`

Similarly, when you enter the Waiting Room, myTags = {"waiting-room"} and mutedTags = deafenedTags = {"lobby", "match"}

Note: The tags cannot have a comma. Currently, if you attempt to set a tag with a comma, it will not stop you but you will run into runtime errors. I'll have some API enhancements that introduce some guardrails and provide ways of settings values with more concise code.

## Closing Thoughts
Tags are very client code friendly way of creating subgroups of users for both transmission and reception of audio.

One thing to note is that now `deafenedPeers` and `defeanedTags` are cumulative. 

Suppose ClientA and ClientB are IDs 1 and 2 respectively and have separate tags "abc" and "xyz". ClientB needs to have 1 in deafenedPeers or/and "abc" in deafenedTags for ClientA to not receive ClientB audio.

My advice would be to use either IDs or tags, not both, unless you really need it.

As always, if you have questions feel free to reach me via email, Discord (my ID is adrenak).