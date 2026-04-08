and RBAC"
];

takeaways.forEach((item, i) => {
  slide16.addText(item, {
    x: 1.0, y: 2.3 + (i * 0.4), w: 8.0, h: 0.3,
    fontSize: 16, color: colors.white
  });
});

slide16.addText("Questions & Discussion", {
  x: 0.5, y: 4.5, w: 9, h: 0.4,
  fontSize: 20, color: colors.white, align: "center"
});

// Save presentation
pres.writeFile({ fileName: "ReactCampus-Technical-Deep-Dive.pptx" })
  .then(() => {
    console.log("✅ Technical presentation created successfully!");
    console.log("📁 File: ReactCampus-Technical-Deep-Dive.pptx");
    console.log("📊 16 slides with code snippets, data flows, and technical details");
  })
  .catch((err) => {
    console.error("❌ Error creating presentation:", err);
  });