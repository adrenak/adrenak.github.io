---
slug: univoice-recipe-adding-proximity-audio
title: UniVoice recipe  Adding proximity audio
date: 2025-07-25
tags: univoice, opensource
description: People keep asking me about it, it's achievable and quite simple. Here's a guide!
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
published: yes
---

A bunch of people have asked me how can be achieve proximity audio chat. Which is a fair question given that UniVoice is primarily targeted towards games and they're often 3D.

Currently proximity audio is not supported out of the box. I do have something under works that would allow you to just drag and drop a component to an avatars head and the audio of players will originate from there. 

That said, until that component is ready, it's possible to get proximity audio using some code.

## Using the OnPeerJoined event 
Look at line 128 of [UniVoiceMirrorSetupSample](https://github.com/adrenak/univoice/blob/acc27a96c1e35920f12196899c97d3a59a6e654b/Assets/Adrenak.UniVoice/Samples/Basic%20Setup%20Scripts/UniVoiceMirrorSetupSample.cs?ref=vatsalambastha.com#L128) script that is included in the UniVoice package. 

That's an event that gets invoked for every other player in the game along with their ID. Note that the peer ID is the ID that Mirror assigns, so it can be used using Mirror APIs. This will come in handy later.

Here's how it works.

Say you join a game that already has 5 players before you, this event will be fired 5 times immediately upon your joining. Now the game has 6 players including you. Later if a 7th player joins, this event will be called again.

The useful thing to note here is that this event gets fired after the audio output for that peer has already been created and placed in the scene. So all you have to do is get that AudioSource and manipulate it to make it proximity audio.

## Finding the AudioSource of a peer
The first thing you'd need to do it get the output of that peer. You can do it like this:

`var peerOutput = _session.PeerOutputs[id];`

This gives you `peerOutput` which is of `IAudioOutput` interface type. So we cast it to `StreamedAudioSourceOutput`. 

`var streamedAudioSourceOutput = peerOutput as StreamedAudioSourceOutput;`

This gives us an object of type [StreamedAudioSourceOutput](https://github.com/adrenak/univoice/blob/acc27a96c1e35920f12196899c97d3a59a6e654b/Assets/Adrenak.UniVoice/Runtime/Impl/Outputs/StreamedAudioSourceOutput.cs?ref=vatsalambastha.com) which is great, because that gives us to access `.Stream` which is of type [StreamedAudioSource](https://github.com/adrenak/unimic/blob/375ba75aeb9d704dd630d9f88bf84f7b7a9765be/Assets/UniMic/Runtime/StreamedAudioSource.cs?ref=vatsalambastha.com). That then gives us access to .UnityAudioSource which is the actual AudioSource playing the peer audio.

So you could write

`var peerAudioSource = streamedAudioSourceOutput.Stream.UnityAudioSource;`

And _that_ object is the AudioSource playing the audio.

By now, we have two key things that we need:

* We already know the ID of this peer provided by the event
* And we just resolved the AudioSource that will play the audio of the peer

Now we only need one last thing, the player gameobject of this peer.

## Finding the player gameobject of a peer
This is where you need to write some code. UniVoice doesn't know about your games avatars so you need to find the avatar of a peer on a client device. You can do this any way you want, but I'll just assume you create a method called `GetAvatarForPeerID` that returns the Transform of the avatar.

Once you have that method, you can call it to get the avatar of the peer

`var peerAvatar = GetAvatarForPeerID(id);`

## Attaching the AudioSource to the avatar
We're almost done now. We have the AudioSource and we have the avatar that it should be parented to. All you have to do now is move the audio source to the avatar root and turn on spatial audio.

```
peerAudioSource.transform.SetParent(peerAvatar);
peerAudioSource.transform.localPosition = Vector3.zero;
peerAudioSource.spatialBlend = 1;peerAudioSource.maxDistance = 10;
```

I've set the max distance to 10 units so the audio will fade out and eventually get quiet when you get out of range.

## Finished code

```csharp
client.OnPeerJoined += id => {    
  // Get the audio output of the peer    
  var peerOutput = _session.PeerOutputs[id];    
  
  // Cast it to the output implementation we're using, StreamedAudioSourceOutput 
  var streamedAudioSourceOutput = peerOutput as StreamedAudioSourceOutput;    
  
  // Get the actual Unity AudioSource that is playing the audio of this peer    
  var peerAudioSource = streamedAudioSourceOutput.Stream.UnityAudioSource;    
  
  // Get the avatar of the peer with this ID. You will have to define you own   
  // GetAvatarForPeerID here. Basically, it just needs to get you the transform   
  // of the player prefab for another client. Note that id here is what Mirror   
  // assigns to the client, which should help with this.    
  var peerAvatar = GetAvatarForPeerID(id);    
  
  // Parent and move the peer AudioSource to the avatar so that it moves with it  
  // Then change the AudioSource settings to get proximity audio    
  peerAudioSource.transform.SetParent(peerAvatar);    
  peerAudioSource.transform.localPosition = Vector3.zero;    
  peerAudioSource.spatialBlend = 1;    peerAudioSource.maxDistance = 10;
};
```

This is a minimal example to get the idea across.

Mirror does things like destroy player instances when you change the scene. Sometimes it takes a while for the player gameobject to be created when a player joins. All this complexity should be handled in your version of `GetAvatarForPeerID`. 

Making this out of the box is on my to-do list and pretty high priority. 

In the meantime if you need help implementing this you can reach out to me on Discord via my ID adrenak or join the Discord server here: [https://discord.gg/UwVfMB9SEU](https://discord.com/invite/UwVfMB9SEU?ref=vatsalambastha.com)