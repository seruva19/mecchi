# Mecchi

## Disclaimer

This project is not dead, I'll resume active work on it in 2025. Unfortunately, I've had limited free time in 2024. If anyone uses this project (I don't think so), thanks for your patience!

## Vision

Mecchi is an attempt to build an AI-powered node-based web audio editor with the long-term goal of evolving into a full-featured modular open-source DAW designed for creating generative music content 😀

## Status

But for now, it's <b>WIP POC</b> and not yet production-ready or close to being a mature product 🙄

## Credits 

It is built on [Stable Audio Open](https://huggingface.co/stabilityai/stable-audio-open-1.0), [Audiocraft](https://github.com/facebookresearch/audiocraft), [AudioLDM 2](https://github.com/haoheliu/AudioLDM2), [AudioSR](https://github.com/haoheliu/versatile_audio_super_resolution), [Bark](https://github.com/suno-ai/bark), [Flask](https://github.com/pallets/flask), [React](https://github.com/facebook/react), [ReactFlow](https://github.com/wbkd/react-flow), [Tailwind](https://github.com/tailwindlabs/tailwindcss) and other great projects 🔥

## Short-term plans

* Generalisation of the node UI
* Parametric nodes
* Config-based nodes (.py) 
* Audiogen
* Enhanced MusicGen nodes
* MAGNeT
* Demucs
* EnCLAP
* Auffusion
* Musicgen training
* Lumina-T2Music
* Decomposing SAO pipeline
* SAO fine-tuning
* Navigation between node groups
* Dark theme

## Pipelines

- [x] TTA (text-to-audio)  
- [ ] ATA (audio-to-audio)  
- [x] ADU (audio-data-upsampling, "audio upscaling")  
- [ ] ADI (audio-data-interpolation, "audio inpainting")  
- [ ] ADC (audio-data-completion, "audio outpainting")  
- [ ] AST (audio-style-transfer)   
- [ ] ADB (audio-data-blending)  
- [ ] ADS (audio-data-separation)   
- [x] ATT (audio-to-text, "audio interrogation")  
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