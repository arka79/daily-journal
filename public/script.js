document.getElementById("submitButton").addEventListener("click", async () => {
    const journal = document.getElementById("journalInput").value.trim();
    const resBox = document.getElementById("responseBox");
    if (!journal) {
      resBox.textContent = "Please enter a journal entry.";
      return;
    }
  
    resBox.textContent = "Thinking...";
  
    try {
      const response = await fetch("/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journal }),
      });
  
      const data = await response.json();
      resBox.innerHTML = (data.reply || "Sorry, I couldn't process that.").replace(/\n/g, "<br>");

    } catch (err) {
      console.error("Error submitting journal:", err);
      resBox.textContent = "Error submitting journal.";
    }
  });
  