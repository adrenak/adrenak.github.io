---
slug: univoice-drag-and-drop-integration
title: UniVoice 4.4.0  Drag and drop integration (with YouTube tutorial)
date: 2025-04-28
tags: univoice, opensource
description: Most UniVoice integration are pretty similar. So just use (or modify) this script.
keywords: univoice, unity, voice, voip, vivox, dissonance, open source
thumbnail: content/images/univoice-mirror-basic-tutorial.webp
published: yes
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/noDXxmlb9F0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I've recently helped a lot of people setup a basic UniVoice integration in their projects. And it became clear that the sample scene is not minimal enough.

The sample scene is basically an example app that also does some UI stuff. Going through the code shows how it can be used. But what most people are looking for is to get basic voice chat working as soon as possible. I've seen some people adding the example app script to their scenes, which will not work as expected.

For this reason, I have now created a basic setup sample that provides a component that you can just add to your Mirror Network manager and get voice chat working immediately.

This [UniVoiceMirrorSetupSample.cs](https://github.com/adrenak/univoice/blob/master/Assets/Adrenak.UniVoice/Samples/Basic%20Setup%20Scripts/UniVoiceMirrorSetupSample.cs?ref=vatsalambastha.com) easily allows you to check if voice chat is working by making sure you have setup UniVoice properly.

The script also provides access to the `IAudioServer<T>` and `IAudioClient<T>` objects that can be used for runtime usage like implementing a push to talk mechanism or changing voice settings.

Based on the integration I have helped people do recently, I recommend that a pretty effective way to use UniVoice is to:

* Have the UniVoice setup run as early as possible in your app/game. Something this component does by running all the setup logic in the Start method. Placing this component on the `NetworkManager` is generally a good idea.
* Providing access to the server and client session objects, in a static or singleton manner. This allows you to work with UniVoice anywhere in your project.

Overall, this sample script is all you need for a basic integration. It gives you access to the UniVoice objects to use at runtime. But if you need more control or customization to the setup logic itself, it serves as a good starting point as well.