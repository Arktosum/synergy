// Define a model
const Item = mongoose.model("Item", itemSchema);

// Create a new item
app.post("/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.send("Item created successfully");
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).send("Error creating item");
  }
});

// Read all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("Error reading items:", err);
    res.status(500).send("Error reading items");
  }
});

// Update an item
app.put("/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    await Item.findByIdAndUpdate(itemId, req.body);
    res.send("Item updated successfully");
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).send("Error updating item");
  }
});

// Delete an item
app.delete("/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    await Item.findByIdAndDelete(itemId);
    res.send("Item deleted successfully");
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send("Error deleting item");
  }
});
