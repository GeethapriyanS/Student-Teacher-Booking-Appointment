import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase Initialization
const firebaseConfig = {
    databaseURL: "https://student-teacher-project-e28b9-default-rtdb.firebaseio.com/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Elements
const teacherName = document.querySelector("#teacher-name");
const content = document.querySelector("#content");
const logoutBtn = document.querySelector("#logout-btn");

// Fetch teacher details
const teacherDetails = JSON.parse(sessionStorage.getItem("teacherDetails"));
if (!teacherDetails) {
    alert("Session expired. Please log in again.");
    window.location.href = "teacher_login.html";
} else {
    teacherName.textContent = teacherDetails.tea_name;
}

// Logout Functionality
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("teacherDetails");
    window.location.href = "teacher_login.html";
});

// Schedule Appointment
window.scheduleAppointment = () => {
    const appointmentTitle = prompt("Enter appointment title:");
    const appointmentDate = prompt("Enter appointment date (YYYY-MM-DD):");

    if (appointmentTitle && appointmentDate) {
        const appointmentsRef = ref(database, `appointments/${teacherDetails.key}`);
        const newAppointment = { title: appointmentTitle, date: appointmentDate };

        push(appointmentsRef, newAppointment)
            .then(() => alert("Appointment scheduled successfully!"))
            .catch((err) => console.error("Error scheduling appointment:", err));
    }
};

// View All Appointments
window.viewAppointments = () => {
    const appointmentsRef = ref(database, `appointments/${teacherDetails.key}`);
    onValue(appointmentsRef, (snapshot) => {
        content.innerHTML = "<h3>All Scheduled Appointments</h3>";
        if (!snapshot.exists()) {
            content.innerHTML += "<p>No appointments found.</p>";
            return;
        }

        let table = `<table><tr><th>Title</th><th>Date</th></tr>`;
        snapshot.forEach((childSnapshot) => {
            const appointment = childSnapshot.val();
            table += `<tr><td>${appointment.title}</td><td>${appointment.date}</td></tr>`;
        });
        table += "</table>";
        content.innerHTML = table;
    });
};

// View Messages
window.viewMessages = () => {
    const messagesRef = ref(database, `tea_users/${teacherDetails.key}/messages`);
    onValue(messagesRef, (snapshot) => {
        content.innerHTML = "<h3>Messages from Students</h3>";
        if (!snapshot.exists()) {
            content.innerHTML += "<p>No messages available.</p>";
            return;
        }

        let table = `<table><tr><th>Student</th><th>Email</th><th>Message</th></tr>`;
        snapshot.forEach((childSnapshot) => {
            const msg = childSnapshot.val();
            table += `<tr><td>${msg.sender_name}</td><td>${msg.sender_email}</td><td>${msg.message}</td></tr>`;
        });
        table += "</table>";
        content.innerHTML = table;
    });
};
