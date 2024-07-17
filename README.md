# Mecchi

## Vision

Mecchi is an attempt to build an AI-powered node-based web audio editor with the long-term goal of evolving into a full-featured modular open-source DAW designed for creating generative music content 😀

## Status

But for now, it's <b>WIP POC</b> and not yet production-ready or close to being a mature product 🙄

## Credits 

It is built on [Stable Audio Open](https://huggingface.co/stabilityai/stable-audio-open-1.0), [Audiocraft](https://github.com/facebookresearch/audiocraft), [AudioLDM 2](https://github.com/haoheliu/AudioLDM2), [AudioSR](https://github.com/haoheliu/versatile_audio_super_resolution), [Bark](https://github.com/suno-ai/bark), [Flask](https://github.com/pallets/flask), [React](https://github.com/facebook/react), [ReactFlow](https://github.com/wbkd/react-flow), [Tailwind](https://github.com/tailwindlabs/tailwindcss) and other great projects 🔥

## Short-term plans

* <b>Workflows save/load</b>
* Generalisation of the node UI
* Parametric nodes
* Config-based nodes (.py) 
* Audiogen
* Enhanced MusicGen nodes
* <b>Interrogation with CLAP</b>
* MAGNeT
* Demucs
* EnCLAP
* Auffusion
* Musicgen training
* Lumina-T2Music
* <b>Decomposing SAO pipeline</b>
* <b>SAO fine-tuning</b>
* Navigation between node groups
* Dark theme

## Pipelines

- [x] TTA (text-to-audio)  
- [ ] <b>ATA (audio-to-audio)</b>  
- [x] ADU (audio-data-upsampling, "audio upscaling")  
- [ ] <b>ADI (audio-data-interpolation, "audio inpainting")</b>  
- [ ] ADC (audio-data-completion, "audio outpainting")  
- [ ] AST (audio-style-transfer)   
- [ ] ADB (audio-data-blending)  
- [ ] <b>ADS (audio-data-separation)</b>  
- [ ] ATT (audio-to-text, "audio interrogation")  
- [ ] MTA (midi-to-audio, "audio controlnet")  
- [ ] ITA (image-to-audio)  
- [ ] VTA (video-to-audio)  
- [ ] ATV (audio-to-video)  

## How it looks? 

Nothing fancy yet 🐥 But here is screenshot anyway:

![img](/screenshots/mecchi.png)

## Usage

Requires Python + Git + Node.js.  
To install, clone repository and run:
```
npm run init
```
To launch application, run:
```
npm run serve
```

And, if you're lucky, the app will be available at `http://localhost:5555/`

## Try online 

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1_hg2a_hwtsEEreQN7EQEKX4GWj5zBvZt)
<br>

(I am not maintaining it, to be honest. If you have issues, please let me know).

## Documentation

One day 😏  
OK, just need more time. Noone uses this, so it's OK to not have docs 🙂