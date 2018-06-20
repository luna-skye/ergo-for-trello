// SETTINGS CLASS
// --------------
const settings = {
    "default": {
        "minimalDark": {
			"state": true,
			"subsettings": {
				"dottedLabels": true,
				"backgroundInfluence": true,
				"wideCard": true,
				"hideExpandBtn": true
			}
		},
        "backgroundGradients": {
			"state": true,
			"subsettings": {
				"gradients": [
		            {
		                "name": "Blue",
                        "colorID": "rgb(0, 121, 191)",
		                "gradient": "linear-gradient(135deg, #0079BF 0%, #1EBDD2 50%, #B5EFA1 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#0079BF", "pos": "0" },
		                    { "hex": "#1EBDD2", "pos": "50" },
		                    { "hex": "#B5EFA1", "pos": "100" }
		                ]
		            },{
		                "name": "Orange",
                        "colorID": "rgb(210, 144, 52)",
		                "gradient": "linear-gradient(135deg, #D29034 0%, #EB9606 50%, #2A241C 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#D29034", "pos": "0" },
		                    { "hex": "#EB9606", "pos": "50" },
		                    { "hex": "#2A241C", "pos": "100" }
		                ]
		            },{
		                "name": "Green",
                        "colorID": "rgb(81, 152, 57)",
		                "gradient": "linear-gradient(135deg, #519839 0%, #A3D21E 50%, #B5EFA1 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#519839", "pos": "0" },
		                    { "hex": "#A3D21E", "pos": "50" },
		                    { "hex": "#B5EFA1", "pos": "100" }
		                ]
		            },{
		                "name": "Red",
                        "colorID": "rgb(176, 70, 50",
		                "gradient": "linear-gradient(135deg, #BA311B 0%, #D2881E 75%, #D37319 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#BA311B", "pos": "0" },
		                    { "hex": "#D2881E", "pos": "75" },
		                    { "hex": "#D37319", "pos": "100" }
		                ]
		            },{
		                "name": "Purple",
                        "colorID": "rgb(137, 96, 158)",
		                "gradient": "linear-gradient(135deg, #5461C0 0%, #801ED2 47%, #963CD3 79%, #972ED8 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#5461C0", "pos": "0" },
		                    { "hex": "#801ED2", "pos": "47" },
		                    { "hex": "#963CD3", "pos": "79" },
		                    { "hex": "#972ED8", "pos": "100" }
		                ]
		            },{
		                "name": "Pink",
                        "colorID": "rgb(205, 90, 145)",
		                "gradient": "linear-gradient(135deg, #EA537D 0%, #D04FD0 50%, #D415FF 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#EA537D", "pos": "0" },
		                    { "hex": "#D04FD0", "pos": "50" },
		                    { "hex": "#D415FF", "pos": "100" }
		                ]
		            },{
		                "name": "Light Green",
                        "colorID": "rgb(75, 191, 107)",
		                "gradient": "linear-gradient(135deg, #4BBF6B 0%, #4FD0C1 50%, #15ABFF 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#4BBF6B", "pos": "0" },
		                    { "hex": "#4FD0C1", "pos": "50" },
		                    { "hex": "#15ABFF", "pos": "100" }
		                ]
		            },{
		                "name": "Light Blue",
                        "colorID": "rgb(0, 174, 204)",
		                "gradient": "linear-gradient(135deg, #00C0FF, #C301FF)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#00C0FF", "pos": "0" },
		                    { "hex": "#C301FF", "pos": "100" }
		                ]
		            },{
		                "name": "Grey",
                        "colorID": "rgb(131, 140, 145)",
		                "gradient": "linear-gradient(135deg, #838C91, #424242)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#838C91", "pos": "0" },
		                    { "hex": "#424242", "pos": "100" }
		                ]
		            }
		        ]
			}
		},
        "cardCounter": {
			"state": true,
			"subsettings": {
				"warningColors": true
			}
		},
        "actionSnapping": { "state": true },
        "listColors": {
			"state": true,
			"presets": {}
		}
    },
    "save": (options) => {
        chrome.storage.sync.set(options, () => {
            console.log('Settings saved...', options);

            // Send Realtime Message to all Trello tabs
            chrome.tabs.query({ url: "https://trello.com/*" }, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs.sendMessage(tab.id, options);
                });
            });
        });
    },
    "get": (callback) => {
        chrome.storage.sync.get(settings.default, (items) => { callback(items); });
    }
};


// ELEMENTS CLASS
// --------------
const el = {
    "create": (type, options) => {
        let e = document.createElement(type);
        if (options.text) { e.innerText = options.text }
        if (options.html) { e.innerHTML = options.html }
        for (var attr in options.attributes)    { e.setAttribute(attr, options.attributes[attr]); }
        for (var listener in options.listeners) { e.addEventListener(listener, options.listeners[listener]); }
        for (var child in options.children)     { e.append(options.children[child]); }

        let s = '';
        for (var style in options.style) { s += style + ': ' + options.style[style] + '; ' };
        e.setAttribute('style', s);

        return e;
    },
    "append": (appender, appendee) => {
        appender.append(appendee);
    },
    "get": (query) => {
        let e = document.querySelectorAll(query);
        return e.length > 1 ? e : e[0];
    },
    "remove": (query) => {
        let e = document.querySelectorAll(query);
        if (e.length > 1) { e.forEach((f) => { f.parentNode.removeChild(f); }); }
        else { e[0].parentNode.removeChild(e[0]); }
    },
    "find": (e, query) => {
        // Element.matches() polyfill
    	if (!Element.prototype.matches) {
    		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
    	}

    	// Get closest match
    	for ( ; e && e !== document; e = e.parentNode ) { if ( e.matches( query ) ) return e; }
    	return null;
    }
}


// GRADIENT CLASS
// --------------
// Gradient Generator
const gradients = {
    "create": (g) => {
        g.forEach((gradient) => {

            // Generate Gradient Color Elements
            let color = {
                "createElement": (label, hex, pos) => {
                    return el.create('div', {
                        attributes: { class: 'color' },
                        children: [
                            // Label
                            el.create('p', {
                                text: label,
                                attributes: { class: 'label' }
                            }),

                            // Color Select
                            el.create('div', {
                                attributes: { class: 'color-select' },
                                children: [
                                    // Color Input
                                    el.create('input', {
                                        attributes: { type: 'color', value: hex },
                                        listeners: { change: (event) => {
                                            let c = el.find(event.target, '.color'), options = el.find(event.target, '.gradient-options');
                                            gradients.updateView(options);
                                        }}
                                    }),

                                    // Remove Button
                                    el.create('div', {
                                        attributes: { class: 'remove-btn', title: 'Remove color' },
                                        listeners: { click: (event) => {
                                            let c = el.find(event.target, '.color'), options = el.find(event.target, '.gradient-options');

                                            if (options.querySelectorAll('.color').length > 1) { c.parentNode.removeChild(c); }
                                            gradients.updateView(options);
                                        }}
                                    }),
                                ]
                            }),

                            // Position Input
                            el.create('input', {
                                attributes: { type: 'number', value: pos },
                                listeners: { input: (event) => {
                                    let color = el.find(event.target, '.color'), options = el.find(event.target, '.gradient-options');
                                    gradients.updateView(options);
                                }}
                            }),
                            el.create('div', { html: '&percnt;', attributes: { class: 'symbol' } })
                        ]
                    });
                },
                "random": () => { }
            }, colorElements = [];
            for (let i = 0; i < gradient.colors.length; i++) {
                colorElements.push( color.createElement( i === 0 ? 'Colors' : '', gradient.colors[i].hex, gradient.colors[i].pos) );
            }

            // Add Color Button
            colorElements.push(el.create('div', {
                attributes: { class: 'fake-color' },
                children: [
                    // Label
                    el.create('p', { attributes: { class: 'label' } }),

                    // Color Select
                    el.create('div', {
                        attributes: { class: 'add-color' },
                        listeners: { click: (event) => {
                            let c = color.createElement('', "#FFFFFF", 100);
                            let colors = event.target.parentNode.parentNode;
                            colors.insertBefore(c, colors.children[colors.children.length - 1]);
                        } }
                    })
                ]
            }))


            // -------------------
            // Append Preset Panel
            el.append(
                el.get('#gradientSettings'),
                el.create('li', {
                    attributes: {
                        "id": gradient.name,
                        "data-col-id": gradient.colorID,
                        "class": "gradient-preset"
                    },
                    children: [
                        // Panel Label
                        el.create('p', {
                            text: gradient.name,
                            attributes: { class: "gradient-title" }
                        }),

                        // Gradient Display
                        el.create('div', {
                            attributes: { class: "gradient-display" },
                            style:      { background: gradient.gradient },
                            listeners: { click: (event) => {
                                el.find(event.target, '.gradient-preset').classList.add('show');
                            }}
                        }),

                        // Options
                        el.create('div', {
                            attributes: { class: "gradient-options" },
                            children: [

                                // Rotation
                                el.create('div', {
                                    children: [
                                        el.create('div', { attributes: { class: 'slider' },
                                            children: [
                                                // Label
                                                el.create('p', { text: 'Rotation', attributes: { class: 'label' } }),

                                                // Range Slider
                                                el.create('input', {
                                                    attributes: { type: 'range', name: 'rotation', value: gradient.rotation, min: 0, max: 360, step: 15 },
                                                    listeners: { input: (event) => {
                                                        let options = el.find(event.target, '.gradient-options'), rotationNum = el.find(event.target, '.slider').querySelector('[name="rot"]');
                                                        gradients.updateView(options);
                                                        rotationNum.value = event.target.value;
                                                    }}
                                                }),

                                                // Number Slider
                                                el.create('input', {
                                                    attributes: { type: 'number', name: 'rot', min: 0, max: 360, value: gradient.rotation },
                                                    listeners: { input: (event) => {
                                                        /*
                                                        let options = el.find(event.target, '.gradient-options'), rotationSlide = el.find(event.target, '.slider').querySelector('[name="rotation"]');
                                                        gradients.updateView(options);
                                                        rotationSlide.value = event.target.value;
                                                        */
                                                    }}
                                                }),

                                                // Degree Symbol
                                                el.create('div', { html: "&deg;", attributes: { class: "symbol" } })
                                            ]
                                        })
                                    ]
                                }),

                                // Colors
                                el.create('div', {
                                    attributes: { class: 'colors' },
                                    children: colorElements
                                })
                            ]
                        }),

                        // Close Button
                        el.create('div', {
                            attributes: { class: 'close-btn' },
                            listeners: { click: (event) => {
                                el.find(event.target, '.gradient-preset').classList.remove('show');
                            }}
                        })
                    ]
                })
            );
        });
    },
    "compile": (options) => {
        let rotation = options.children[0].children[0].children[1].value;

        let colors = '';
        options.querySelectorAll('.colors .color').forEach((c) => {
            let hex = c.querySelector('input[type="color"]').value;
            let pos = c.querySelector('input[type="number"]').value;
            colors += hex+' '+pos+'%, ';
        });

        let gradient = "linear-gradient("+rotation+"deg, "+colors.substring(0, colors.length - 2)+")";

        return gradient;
    },
    "updateView": (options) => {
        options.parentNode.querySelector('.gradient-display').style.background = gradients.compile(options);

        let option = {};
        option.backgroundGradients = {};
        option.backgroundGradients.state = document.getElementById('backgroundGradients').checked;
        option.backgroundGradients.subsettings = {};
        option.backgroundGradients.subsettings.gradients = gradients.setting();

        settings.save(option);
    },
    "setting": () => {
        let setting = [];

        document.querySelectorAll('.gradient-preset').forEach((preset) => {
            let piece = {
                name: preset.id,
                colorID: preset.getAttribute('data-col-id'),
                rotation: preset.children[2].children[0].children[0].children[1].value,
                gradient: gradients.compile(preset.children[2])
            }

            let colors = [];
            preset.querySelectorAll('.colors .color').forEach((c) => {
                if (!c.id) { colors.push({ hex: c.querySelector('input[type="color"]').value, pos: c.querySelector('input[type="number"]').value }); }
            });
            piece.colors = colors;

            setting.push(piece);
        });

        return setting;
    }
}

// REMOVECLASSFROMALL
// ------------------
const removeClassFromAll = (el, className) => {
	Array.from(el).forEach((element) => { element.classList.remove(className); });
};



// WINDOW ONLOAD
// -------------
window.onload = () => {
    settings.get(options => {
        console.log("Initialized with settings...", options);
        for (var key in options) {
            document.getElementById(key).checked = options[key].state;

            for (var sub in options[key].subsettings) {
                if (sub !== 'gradients') { document.getElementById(sub).checked = options[key].subsettings[sub]; }
            }
        }
        gradients.create(options.backgroundGradients.subsettings.gradients);
    });


    // SETTINGS NAVIGATION
    // -----------------------
    // Menu Button Interations
    let menuBtns       = document.querySelectorAll('.option-io li.detailed-settings .setting-label');
    let ioSettings     = document.querySelector('.option-io');
    let settingDetails = document.querySelector('.option-details');
    menuBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            settingDetails.classList.add('show');

            document.querySelectorAll('.option-details div.detail-pane').forEach((detailPane) => { detailPane.classList.remove('show'); });
            document.getElementById(btn.parentNode.children[0].children[1].getAttribute('for')+'-settings').classList.add('show');

            ioSettings.classList.add('show-back');
        });
    });

    // Back Button
    let backButton = document.querySelector('.back-btn');
    backButton.addEventListener('click', () => {
        settingDetails.classList.remove('show');
        document.querySelectorAll('.option-details div.detail-pane').forEach((detailPane) => { detailPane.classList.remove('show'); });
        ioSettings.classList.remove('show-back');
    });


    // SETTINGS CHANGES
    // ----------------
    // Checkbox
    document.querySelectorAll('.checkbox').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            let setting = checkbox.children[0].getAttribute('name');
            let parentSetting = checkbox.getAttribute('data-parentSetting');
            if (parentSetting != null) {
                let options = {};
                options[parentSetting] = {};
                options[parentSetting].state = document.getElementById(parentSetting).checked;
                options[parentSetting].subsettings = {};

                document.querySelectorAll('.checkbox[data-parentSetting = '+parentSetting+']').forEach((subsetting) => {
                    let subsettingName = subsetting.children[0].getAttribute('name');
                    options[parentSetting].subsettings[subsettingName] = subsetting.children[0].checked;
                });

                settings.save(options);
            } else {
                let options = {};
                options[setting] = {};
                options[setting].state = checkbox.children[0].checked;
                if (setting == 'backgroundGradients') {
                    options[setting].subsettings = {};
                    options[setting].subsettings.gradients = gradients.setting();
                }

                settings.save(options);
            }
        });
    });
}
