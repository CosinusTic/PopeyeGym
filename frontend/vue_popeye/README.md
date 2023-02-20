# Popeye's Gym

![](./public/made-by-ana%C3%AFs.svg)
![](./public/made-by-cl%C3%A9mentine.svg)
![](./public/made-by-robin(2).svg)
![](./public/made-by-nathan.svg)


Popeye's Gym is a Fitness website developped with VueJS as frontend, ExpressJS as backend and using a MongoDB database.

Popeye's Gym implements the following features :
- a backend recipes_express http://localhost:3001/
- a backend user_express http://localhost:3002/
- a frontend http://localhost:5173/
- a login register page where you can register as user or coach
- a scheme page where you can choose your training program
- a profile page for both coaches and users that you can edit and where you can manage your appointments
- a coaches page where you can book a coach and grade them
- a gyms page where you can find gyms near you
- a recipe page where you can filter multiple recipes for your diet
- an admin dashboard where you can find charts and metrics of the website
- a user management page where the admin can create update and delete users
- a coach management page where the admin can create update and delete coaches
- an appointments management page where the admin can delete appointements or make new ones between a coach and an user


## Tech Stack
**Frontend:** Vue.js, HTML, CSS, Axios, toaster, playwright, carto
**Backend:** Express.js, Javascript, swagger, jest
**DB:** MongoDB, Mongoose

## Run Locally
Clone the project

```sh
git clone git@github.com:EpitechCodingAcademyPromo2023/C-COD-260-PAR-2-1-ecp-clementine.amouroux
```

Go to the project directory
```bash
  install Node.js  https://nodejs.org/en/download/
  install Express.js  https://expressjs.com/en/starter/installing.html
  install Vue.js   https://v2.vuejs.org/v2/guide/installation.html
> cd <your-project-name>
```

Install dependencies in the back and in the front
```sh
npm install
```

Start both backends server
```sh
node server.js
```

Start the frontend server
```sh
npm run dev
```

Command for backend tests:
```sh
NODE_OPTIONS=--experimental-vm-modules npx jest filename.test.js
```

Command for frontend tests:
```sh
npx playwright test --project chromium
```

## The Dev Team
Nathan Delmarche ~ Clémentine Amouroux ~ Anaïs Letellier ~ Robin Robilliard