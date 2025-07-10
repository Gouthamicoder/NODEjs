const http = require("http")
//window.alert("Server requested")    
http.createServer((request,response)=>{
   // window.alert("Server requested")
    console.log("3qqdHELLO")
    response.write("HELLO GOUTHAMI")
    response.end()
}).listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});