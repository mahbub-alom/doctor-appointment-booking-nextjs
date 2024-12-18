import cors from "cors";
import { Server } from "socket.io";
const hostname =
  process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import next from "next";
import onCall from "./socket-events/onCall.js";
import onHangup from "./socket-events/onHangup.js";
import onWebrtcSignal from "./socket-events/onWebrtcSignal.js";
dotenv.config({ path: ".env.local" });
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname, PORT });
const handle = app.getRequestHandler();
const server = express();

server.use(
  cors({
    origin: [
      "https://doctor-appointment-booking-web-app.netlify.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// Add headers middleware
server.use((req, res, next) => {
  // The origin should match your frontend domain
  res.header(
    "Access-Control-Allow-Origin",
    "https://doctor-appointment-booking-web-app.netlify.app"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

server.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eybo8gi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const categoryCollection = client
      .db("doctor-appointment-booking")
      .collection("category");
    const doctorCollection = client
      .db("doctor-appointment-booking")
      .collection("doctor");
    const bookingCollection = client
      .db("doctor-appointment-booking")
      .collection("booking");
    const userCollection = client
      .db("doctor-appointment-booking")
      .collection("user");

    server.get("/api/category", async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result);
    });

    server.get("/api/doctor", async (req, res) => {
      const result = await doctorCollection.find().toArray();
      res.send(result);
    });

    server.get("/api/doctor/:category", async (req, res) => {
      const category = req.params.category;
      try {
        const result = await doctorCollection
          .find({
            categories: { $in: [category] },
          })
          .toArray();
        res.json(result);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Failed to fetch doctors" });
      }
    });

    server.get("/api/doctors/:id", async (req, res) => {
      const category = req.params.id;
      const filter = { _id: new ObjectId(category) };

      try {
        const result = await doctorCollection.findOne(filter);
        res.json(result);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Failed to fetch doctors" });
      }
    });

    // server.post("/api/appointments", async (req, res) => {
    //   try {
    //     const data = req.body;

    //     // Example validation (optional)
    //     if (
    //       !data.UserName ||
    //       !data.Email ||
    //       !data.Time ||
    //       !data.Date ||
    //       !data.doctorId
    //     ) {
    //       return res.status(400).send({ error: "Missing required fields" });
    //     }

    //     const result = await bookingCollection.insertOne(data);
    //     res.send(result);
    //   } catch (error) {
    //     console.error("Error creating appointment:", error);
    //     res.status(500).send({ error: "Failed to create appointment" });
    //   }
    // });

    //send email

    const sendEmail = async (recipient, subject, text) => {
      const apiKey = process.env.SENDINBLUE_API_KEY;

      try {
        const response = await axios.post(
          "https://api.sendinblue.com/v3/smtp/email",
          {
            sender: { email: "mdmahbuba034@gmail.com" },
            to: [{ email: recipient }],
            subject: subject,
            textContent: text,
          },
          {
            headers: {
              "api-key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Email sent successfully:", response.data);
      } catch (error) {
        console.error(
          "Error sending email:",
          error.response?.data || error.message
        );
      }
    };

    server.post("/api/appointments", async (req, res) => {
      try {
        const data = req.body;

        // Example validation
        if (
          !data.UserName ||
          !data.Email ||
          !data.Time ||
          !data.Date ||
          !data.doctorId
        ) {
          return res.status(400).send({ error: "Missing required fields" });
        }

        // Save the booking to MongoDB
        const result = await bookingCollection.insertOne(data);

        // After saving, send confirmation email to patient and doctor
        const appointmentDetails = {
          patientName: data.UserName,
          doctorName: data.doctorId,
          date: data.Date,
          time: data.Time,
        };

        // Send email to patient
        const patientEmail = data.Email;
        const patientSubject = `Appointment Confirmation - ${appointmentDetails.patientName}`;
        const patientText = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Hello <strong style="color: #1E90FF;">${appointmentDetails.patientName}</strong>,</p>
      
          <p>We’re pleased to confirm your appointment with <strong>${appointmentDetails.doctorName}</strong>!</p>
      
          <p style="background-color: #f0f8ff; padding: 10px; border-radius: 5px;">
            <span style="color: #2E8B57; font-weight: bold;">📅 Date:</span> ${appointmentDetails.date}<br>
            <span style="color: #2E8B57; font-weight: bold;">🕒 Time:</span> ${appointmentDetails.time}
          </p>
      
          <p>Please arrive a few minutes early to ensure a smooth experience. If you have any questions or need to reschedule, feel free to reach out.</p>
      
          <p>Looking forward to seeing you there!</p>
      
          <p style="color: #555;">Best Regards,<br>
          <strong style="color: #1E90FF;">The Doctor Appointment Booking Team</strong></p>
        </div>
      `;

        await sendEmail(patientEmail, patientSubject, patientText);

        // Send email to doctor
        const doctorEmail = "mdmahbuba034@gmail.com";
        const doctorSubject = `New Appointment - ${appointmentDetails.patientName}`;
        const doctorText = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Hello <strong style="color: #1E90FF;">${appointmentDetails.doctorName}</strong>,</p>
      
          <p>You have a new appointment scheduled with <strong style="color: #1E90FF;">${appointmentDetails.patientName}</strong>!</p>
      
          <p style="background-color: #f0f8ff; padding: 10px; border-radius: 5px;">
            <span style="color: #2E8B57; font-weight: bold;">📅 Date:</span> ${appointmentDetails.date}<br>
            <span style="color: #2E8B57; font-weight: bold;">🕒 Time:</span> ${appointmentDetails.time}
          </p>
      
          <p>Please make sure to prepare accordingly for this appointment. If you have any questions or need further details, don’t hesitate to reach out.</p>
      
          <p>Best of luck with your appointment, and thank you for providing excellent care!</p>
      
          <p style="color: #555;">Best Regards,<br>
          <strong style="color: #1E90FF;">The Doctor Appointment Booking Team</strong></p>
        </div>
      `;

        await sendEmail(doctorEmail, doctorSubject, doctorText);
        res.send(result);
      } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).send({ error: "Failed to create appointment" });
      }
    });

    //--------------

    server.get("/api/booking/:email", async (req, res) => {
      const email = req.params.email;
      const query = { Email: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    server.delete("/api/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    //user data database post here
    server.post("/api/user", async (req, res) => {
      const users = req.body;
      const query = { email: users?.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exits", insertedId: null });
      }
      const result = await userCollection.insertOne(users);
      res.send(result);
    });

    //user get api
    server.get("/api/users/doctor/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let doctor = false;
      if (user) {
        doctor = user?.role === "doctor";
      }
      res.send({ doctor });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

export let io;

app.prepare().then(() => {
  // Start the Express server and attach Socket.io to it
  const httpServer = server.listen(PORT, () => {
    console.log(`> Ready on http://${hostname}:${PORT}`);
  });

  io = new Server(httpServer, {
    cors: {
      origin: [
        "https://doctor-appointment-booking-web-app.netlify.app",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
      ],
    },
  });

  let onlineUsers = [];
  io.on("connection", (socket) => {
    //add user
    socket.on("addNewUser", (clerkUser) => {
      if (
        clerkUser &&
        !onlineUsers.some((user) => user?.userId === clerkUser.id)
      ) {
        onlineUsers.push({
          userId: clerkUser.id,
          socketId: socket.id,
          profile: clerkUser,
        });
      }
      io.emit("getUsers", onlineUsers);
    });
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      // send active user
      io.emit("getUsers", onlineUsers);
    });

    //call events
    socket.on("call", onCall);
    socket.on("webrtcSignal", onWebrtcSignal);
    socket.on("hangup", onHangup);
  });

  // Next.js custom API route
  server.get("/api/", (req, res) => {
    res.json({ message: "Hello from Express!" });
  });

  // Handle all other routes with Next.js
  server.all("*", (req, res) => handle(req, res));

  // // Example custom API route
  // server.get("/api/", (req, res) => {
  //   res.json({ message: "Hello from Express!" });
  // });

  // // Handle all other routes with Next.js
  // server.all("*", (req, res) => {
  //   return handle(req, res);
  // });

  // // Start the server
  // server.listen(PORT, (err) => {
  //   if (err) throw err;
  //   console.log(`> Ready on http://localhost:${PORT}`);
  // });
});
