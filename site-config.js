// Site Configuration for Gorky Documentation Site
module.exports = {
    baseUrl: 'https://adrenak.github.io',
    siteName: 'Vatsal Ambastha',
    authorName: 'Vatsal Ambastha',
    defaultDescription: 'Personal website and blog of Vatsal Ambastha',
    defaultKeywords: 'Unity, game development, virtual reality, ManageXR, open source, unity3d, AR, VR',
    favicon: 'favicon.ico',
    appleTouchIcon: 'apple-touch-icon.png',
    avatar: 'content/images/sf.jpg',
    
    // GoatCounter Analytics Configuration
    goatCounterEnabled: true,
    goatCounterCode: 'vatsalambastha',
    allowLocal: false,
    allowFrame: false,
    noOnload: false,

    theme: 'adrenak',

    postsPerPage: 10,

    themeOptions: [
        'default',
        'adrenak',
        'candy',
        'coralreef',
        'cyberpunk',
        'desert',
        'dollhouse',
        'earthy',
        'finding-nemo',
        'forest',
        'frost',
        'futurism',
        'hacker',
        'hellhole',
        'magazine',
        'ocean',
        'pulpfiction',
        'rustpunk',
        'simple-dark',
        'simple-light',
        'thematrix',
        'typewriter',
        'underwater',
        'utopia',
        'vicecity',
    ],
    
    // Sidebar Configuration
    sidebar: {
        header: 'Vatsal Ambastha',
        homeDisplayName: '🏠 Home',
        postsDisplayName: '✍️ Posts',
        footer: [
            {
                text: '2025 © Vatsal Ambastha',
                target: 'https://adrenak.github.io',
                openInNewTab: true
            },
            {
                text: 'Get this website template',
                target: 'https://github.com/adrenak/gorky',
                openInNewTab: true
            }
        ],
        sections: {
            "": {
                    "Work" : {
                        "target":"?page=work",
                        "openInNewTab": false
                    }
                },
            "🔗 Links": {
                "Email": {
                    "target" : "mailto:ambastha.vatsal@gmail.com",
                    "openInNewTab" : true
                },
                "Github": {
                    "target" : "https://www.github.com/adrenak",
                    "openInNewTab" : true
                },
                "LinkedIn": {
                    "target" : "https://www.linkedin.com/in/vatsalambastha",
                    "openInNewTab" : true
                }
            }
        }
    }
};
