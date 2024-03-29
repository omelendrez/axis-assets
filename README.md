# axis-assets

This node app is the Axis microservice and handles picture upload and sourcing for the frontend app.

---

## 🔵 Tolmann - Axis 2.0 Assets setup

You should have Nodejs version 16 or higher installed in the server.

If Nodejs is not installed you should install version 18.15.0 from https://nodejs.org/en

---

## 🔵 Clonning and installing the app

Install **Git** from https://git-scm.com/ by clicking on the Download for Windows button inside the image with a computer monitor and current stable version number. You will need git to perform several activities, mainly by using **Git Bash**.

Once installe, run **Git Bash** in order to open the _bash terminal_. (To find Git Bash app just click on Start icon in Windows machine and type **git bash**.)

Here is where you are going to perform the app setup and run it.

You will need to have a folder called **webserver** in drive **C:**.

**Tip:** _Always press Enter after each command you are requested to type._

In order to do that, change to drive **C:** by typing:

```bash
cd /c/
```

After that, just type

```bash
mkdir webserver
```

This command will create (if not exists) the folder **webserver** in **C:** drive

If the folder already exists you should get the following error message:

```bash
mkdir: cannot create directoary 'webserver':: File exists
```

Don't worry if you got the message. This is expected and nothing wrong will happen to the process.

You have now to move inside that directory by doing:

```bash
cd webserver
```

Now you have to clone the GitHub repository by runing the following command:

```bash
git clone https://github.com/omelendrez/axis-assets.git
```

Now you have to move inside the new folder created by the clone action as follows:

```bash
cd axis-assets
```

Create the folder a folder called `uploads` and then inside that folder, create a new one called `pictures`.
The path should look like this:

```bash
c/webserver/axis-assets/uploads/pictures
```

You should run now:

```bash
npm ci
```

This command line will install all the app dependencies.

Once the installation is done, you can run the server by typing:

```bash
npm start
```

The app will show in the terminal when the server is ready.

Finally you have to copy all the photographs from the legacy server into the new server folder:

| Source (Legacy)          | Destination (Axis 2)                       |
| ------------------------ | ------------------------------------------ |
| `...Axis/Employees/Pics` | `c/webserver/axis-assets/uploads/pictures` |

If everything concludes without errors, you will be able to see the trainees' photograph in the frontend app.
<img width="1280" alt="image" src="https://user-images.githubusercontent.com/7883563/235481303-3d093d83-2aff-4b2d-b495-85c3b19385b8.png">

## Node version

We use `v20.9.0` and we will not upgrade yet due to a warning caused by the issue below which shows up starting with `v21.0.0`.

https://github.com/forcedotcom/cli/issues/2535
