import app from "./app";


app.set("port", process.env.PORT || "4444");

const server = app.listen(app.get("port"), () => {
    console.log(
        "\tApp is running at http://localhost:%d in %s mode.",
        app.get("port"),
        app.get("env")
      );
      console.log("\tPress CTRL-C to stop.\n");
});


export default server;
