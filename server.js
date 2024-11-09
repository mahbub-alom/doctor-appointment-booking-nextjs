// server.js
import express from "express";
import axios from "axios";
import next from "next";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();
const PORT = process.env.PORT || 3000;

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
          Dear ${appointmentDetails.patientName},
          
          Your appointment with Dr. ${appointmentDetails.doctorName} has been confirmed for ${appointmentDetails.date} at ${appointmentDetails.time}.
          
          Regards,
          Doctor Appointment Booking
        `;
        await sendEmail(patientEmail, patientSubject, patientText);

        // Send email to doctor
        const doctorEmail = "mdmahbuba034@gmail.com"; 
        const doctorSubject = `New Appointment - ${appointmentDetails.patientName}`;
        const doctorText = `
          Dear ${appointmentDetails.doctorName},
          
          You have a new appointment with ${appointmentDetails.patientName} on ${appointmentDetails.date} at ${appointmentDetails.time}.
          
          Regards,
          Doctor Appointment Booking
        `;
        await sendEmail(doctorEmail, doctorSubject, doctorText);
        res.send(result);
      } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).send({ error: "Failed to create appointment" });
      }
    });

  //--------------

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

app.prepare().then(() => {
  // Example custom API route
  server.get("/api/", (req, res) => {
    res.json({ message: "Hello from Express!" });
  });

  // Handle all other routes with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
