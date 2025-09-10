// ==UserScript==
// @name         BibleGatewayLooper.user.js
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a loop toggle to BibleGateway audio.
// @author       Ivan Allen
// @match        https://www.biblegateway.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const LOOP_KEY = 'biblegateway_loop_enabled';

    function waitForAudio(attempts = 0) {
        const audio = document.querySelector('audio');
        if (audio) {
            initLoopControl(audio);
        } else if (attempts < 20) {
            setTimeout(() => waitForAudio(attempts + 1), 500);
        }
    }

    function initLoopControl(audio) {
        // Apply stored loop setting
        const isLooping = localStorage.getItem(LOOP_KEY) === 'true';
        audio.loop = isLooping;

        // Create container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '15px';
        container.style.right = '15px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        container.style.fontSize = '14px';
        container.style.color = '#fff';
        container.style.backgroundColor = '#333';
        container.style.borderRadius = '2px';
        container.style.padding = '4px 8px';
        container.style.userSelect = 'none';

        // Label: "Loop:"
        const label = document.createElement('span');
        label.textContent = 'Loop:';
        label.style.marginRight = '6px';
        container.appendChild(label);

        // Toggle container
        const toggleLabel = document.createElement('label');
        toggleLabel.style.position = 'relative';
        toggleLabel.style.display = 'inline-block';
        toggleLabel.style.width = '36px';
        toggleLabel.style.height = '18px';
        toggleLabel.style.marginRight = '6px';
        toggleLabel.style.cursor = 'pointer';

        // Hidden checkbox input
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isLooping;
        checkbox.style.opacity = '0';
        checkbox.style.width = '0';
        checkbox.style.height = '0';

        // Styled slider
        const slider = document.createElement('span');
        slider.style.position = 'absolute';
        slider.style.top = '0';
        slider.style.left = '0';
        slider.style.right = '0';
        slider.style.bottom = '0';
        slider.style.backgroundColor = isLooping ? '#4CAF50' : '#ccc';
        slider.style.transition = '.4s';
        slider.style.borderRadius = '34px';

        const knob = document.createElement('span');
        knob.style.position = 'absolute';
        knob.style.height = '14px';
        knob.style.width = '14px';
        knob.style.left = isLooping ? '20px' : '2px';
        knob.style.bottom = '2px';
        knob.style.backgroundColor = 'white';
        knob.style.transition = '.4s';
        knob.style.borderRadius = '50%';

        slider.appendChild(knob);
        toggleLabel.appendChild(checkbox);
        toggleLabel.appendChild(slider);
        container.appendChild(toggleLabel);

        // ON/OFF Text
        const stateText = document.createElement('span');
        stateText.textContent = isLooping ? 'ON' : 'OFF';
        stateText.style.minWidth = '28px';
        stateText.style.textAlign = 'left';
        container.appendChild(stateText);

        // Logic
        checkbox.addEventListener('change', () => {
            const enabled = checkbox.checked;
            audio.loop = enabled;
            localStorage.setItem(LOOP_KEY, enabled.toString());
            slider.style.backgroundColor = enabled ? '#4CAF50' : '#ccc';
            knob.style.left = enabled ? '20px' : '2px';
            stateText.textContent = enabled ? 'ON' : 'OFF';
        });

        document.body.appendChild(container);

        console.log('BibleGateway loop toggle initialized:', isLooping ? 'ON' : 'OFF');
    }

    waitForAudio();
})();
