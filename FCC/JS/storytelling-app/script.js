const storyContainer = document.querySelector(".story-container");

const scaryStoryBtn = document.getElementById("scary-btn");
const funnyStoryBtn = document.getElementById("funny-btn");
const adventureStoryBtn = document.getElementById("adventure-btn");

const resultParagraph = document.getElementById("result");

// Story data object
const storyObj = {
    scary: {
        text: "In the darkness of the forest, something stirred. Eyes glowed in the shadows, watching, waiting. Every step deeper into the woods felt like a mistake, but turning back was no longer an option. The whispers began softly, growing louder with each passing second. 'You shouldn't have come here,' they seemed to say. Suddenly, a branch snapped behind her. She spun around, but there was nothing there. Or was there?",
        borderColor: "var(--red)",
        icon: "👻"
    },
    funny: {
        text: "A man walks into a library and asks for books on paranoia. The librarian whispers, 'They're right behind you!' The man turns around nervously, then looks back at the librarian and says, 'That's exactly what someone who's part of the conspiracy would say.' The librarian winks and says, 'Bingo!' Meanwhile, a penguin waddles in and asks for books on ice. The librarian points to the refrigerator section. The penguin looks confused and says, 'I meant ice fishing!' The librarian shrugs and says, 'Well, we have plenty of frozen sections!'",
        borderColor: "var(--gold)",
        icon: "😂"
    },
    adventure: {
        text: "The map was ancient, its edges frayed and corners burnt. Captain Elena unfolded it carefully, revealing a path to a forgotten island. Legends spoke of treasures beyond imagination, guarded by creatures of myth. With her trusted crew aboard the 'Wandering Dream', she set sail into the unknown. Storms raged, waves crashed, but their spirits remained unbroken. On the seventh day, land appeared on the horizon. But this was no ordinary island - it pulsed with an ethereal light, and the air hummed with magic. Their adventure was just beginning.",
        borderColor: "var(--green)",
        icon: "🗺️"
    }
};

// Display story with animation
const displayStory = (storyType) => {
    const story = storyObj[storyType];
    
    // Add fade out effect
    resultParagraph.style.opacity = 0;
    
    // After fade out, update content and fade in
    setTimeout(() => {
        resultParagraph.innerHTML = `<span class="story-icon">${story.icon}</span> ${story.text}`;
        resultParagraph.style.borderColor = story.borderColor;
        resultParagraph.style.opacity = 1;
    }, 300);
}

// Add hover effects to buttons
const addHoverEffects = () => {
    const buttons = [scaryStoryBtn, funnyStoryBtn, adventureStoryBtn];
    buttons.forEach((button, index) => {
        const types = ['scary', 'funny', 'adventure'];
        const type = types[index];
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = `0 5px 15px ${storyObj[type].borderColor}80`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        });
    });
}

// Initialize hover effects
addHoverEffects();

// Event listeners for story buttons
scaryStoryBtn.addEventListener("click", () => displayStory("scary"));
funnyStoryBtn.addEventListener("click", () => displayStory("funny"));
adventureStoryBtn.addEventListener("click", () => displayStory("adventure"));

