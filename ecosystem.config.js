module.exports = {
    apps: [
        {
            name: "app",
            script: "./dist/app/scripts/prod.js",
            watch: false,
            autorestart: true,  // автоматический рестарт при падении
            max_memory_restart: "200M" // рестарт, если память превышает 200MB
        }
    ]
};