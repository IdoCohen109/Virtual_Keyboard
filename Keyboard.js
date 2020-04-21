const Keyboard = {
    elements: {
        main: null, //main keyboard element
        keysContainer: null, //refer to keys container
        keys: [] //refer to the keys buttons
    },


    //functions for handling the keyboard uses on input/close
    eventHandlers: {
        oninput: null,
        onclose: null
    },

    //contains the different values of the keyboard 
    properties: {
        value: "", //the current value of the keyboard
        capsLock: false //true or false for caps lock active
    },

    init() {
        // Create main Elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        //Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys()); //createKeys will return the keyboard buttons
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        //Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        //append keysContainer into main - father-child connection
        document.body.appendChild(this.elements.main); //append main into body - father-child connection

        //automatically use keyboard or elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });


    },


    //private method
    //create all the html for each one of the keys in the keyboard
    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ]; //contains the key layer 

        //create HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`
        };

        //looping over the keyLayer array to create the HTML buttons
        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");

            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1; // the indexOf the key we are looping at will return true if the key is one of the words in the array or return -1 if not

            // Add attribute/Class
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1); // function to remove the second last character from the current values
                        this._triggerEvents("oninput"); //notify input has changed
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvents("oninput");
                    });
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock(); //to toggle the capsLock mode
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock); //the 'this.properties.capsLock value is for checking the status of this value and force it with the class declared in the 1st value -- toggle on/off the class
                    });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvents("oninput");
                    });
                    break;


                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvents("onclose");
                    });
                    break;

                    //setting a default value if none of the above cases has not been covered 
                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toLocaleUpperCase() : key.toLocaleLowerCase(); //check if the capsLock is active
                        this._triggerEvents("oninput");
                    });
                    break;
            }

            fragment.appendChild(keyElement); // add the elements to the fragment 

            //check if we need to insert line break according to the "indexOf" we declared earlier
            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }

        });
        return fragment;

    },


    //triggering the 2 events we declare above - oninput/onclose
    _triggerEvents(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    //toggle capslock mode
    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock; //flip the current status of the caps lock

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toLocaleUpperCase() : key.textContent.toLocaleLowerCase();
            } //childElementCount is counting how many child does the element has, so here we want to check if it is an element with an icon or regular button
        }

    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || ""; //reset value of keyboard
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = ""; //reset values
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

//add event listener to when all the DOM content is loaded - call keyboard init function

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});