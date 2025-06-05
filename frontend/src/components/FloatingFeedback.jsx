import React, { useState } from "react";

const FloatingFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(""); // to show submission status

  const toggleForm = () => setIsOpen((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("Sending...");

    const formData = new FormData(e.target);

    // Append your public API key (access_key)
    formData.append("access_key", "43b5f63c-50b5-4b5f-a437-b1d7e7c3a8e7");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("");
        e.target.reset();
        setIsOpen(false); // close the form popup immediately
        setSubmitted(true); // show thank you message

        setTimeout(() => {
          setSubmitted(false); // hide thank you message after 3 seconds
        }, 3000);
      } else {
        setResult("Error: " + data.message);
      }
    } catch (error) {
      setResult("Error submitting form. Try again.");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleForm}
        aria-label="Open feedback form"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "#8e7cc3",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          cursor: "pointer",
          boxShadow:
            "0 6px 12px rgba(142, 124, 195, 0.6), 0 12px 24px rgba(142, 124, 195, 0.3)",
          fontSize: 26,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          zIndex: 10000,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow =
            "0 12px 24px rgba(142, 124, 195, 0.8), 0 24px 48px rgba(142, 124, 195, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 6px 12px rgba(142, 124, 195, 0.6), 0 12px 24px rgba(142, 124, 195, 0.3)";
        }}
      >
        📝
      </button>

      {/* Feedback Form Popup */}
      {isOpen && !submitted && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 320,
            backgroundColor: "#f3f0ff",
            boxShadow:
              "0 8px 20px rgba(142, 124, 195, 0.3), 0 12px 40px rgba(142, 124, 195, 0.2)",
            borderRadius: 12,
            padding: 20,
            zIndex: 10000,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#4b3e85",
          }}
        >
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: 12, fontWeight: "700", fontSize: 20 }}>
              Feedback
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 12,
                borderRadius: 8,
                border: "1.5px solid #b6a9e0",
                fontSize: 15,
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 12,
                borderRadius: 8,
                border: "1.5px solid #b6a9e0",
                fontSize: 15,
              }}
            />

            <textarea
              name="message"
              placeholder="Write your feedback here..."
              rows={5}
              required
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1.5px solid #b6a9e0",
                resize: "none",
                marginBottom: 12,
                fontSize: 15,
                backgroundColor: "white",
                boxShadow: "inset 2px 2px 6px rgba(142, 124, 195, 0.15)",
                transition: "border-color 0.3s ease",
                outline: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={toggleForm}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#7a6dbd",
                  fontWeight: "600",
                  fontSize: 14,
                  padding: "6px 10px",
                  borderRadius: 6,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8e7cc3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a6dbd")}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: "#8e7cc3",
                  color: "white",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: 15,
                  boxShadow:
                    "0 4px 10px rgba(142, 124, 195, 0.6), 0 8px 20px rgba(142, 124, 195, 0.4)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#7a6dbd")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#8e7cc3")
                }
              >
                Submit
              </button>
            </div>
          </form>

          {/* Show submission status (errors, sending) */}
          {result && (
            <p
              style={{
                marginTop: 12,
                color: "red",
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              {result}
            </p>
          )}
        </div>
      )}

      {/* Floating submission confirmation popup */}
      {submitted && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            backgroundColor: "#9b88f6",
            color: "white",
            padding: "10px 20px",
            borderRadius: 12,
            boxShadow:
              "0 6px 18px rgba(155, 136, 246, 0.7), 0 12px 36px rgba(155, 136, 246, 0.5)",
            zIndex: 10000,
            fontWeight: "600",
            fontSize: 15,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Thank you for your feedback!
        </div>
      )}
    </>
  );
};

export default FloatingFeedback;
