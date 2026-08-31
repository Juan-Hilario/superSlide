const soundModules = import.meta.glob("../../assets/sounds/*.mp3", {
    eager: true,
    import: "default",
});

const sounds = Object.values(soundModules);

let lastSound = -1;

export const playRandomSound = () => {
    let index;
    do {
        index = Math.floor(Math.random() * sounds.length);
    } while (index === lastSound && sounds.length > 1);

    lastSound = index;
    const audio = new Audio(sounds[index]);
    audio.play();
};
