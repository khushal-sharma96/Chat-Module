import App from "./main"

const PORT = process.env.PORT || 8000;

App.listen(PORT,()=>{
    console.log("Websocket Chat Server is running on port: ",PORT);
})

console.log("Hello TypeScript");