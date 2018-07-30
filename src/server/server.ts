import app from "./app";


app.set("port", process.env.PORT || "4444");

const server = app.listen(app.get("port"), () => {
    const tab = "  ";
    console.log(
        `${tab}App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode.\n` +
        `${tab}Press CTRL-C to stop.\n`
    );
});


export default server;
