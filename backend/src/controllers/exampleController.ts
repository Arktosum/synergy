import { Request, Response } from 'express';

// // Create a new item
// export async function createitem(req: Request, res: Response) {
//     const item = new Item(req.body);
//     await item.save();
//     res.status(201).json(item);
// };

// // Get all items
// export async function getitems(req: Request, res: Response) {
//     const items = await Item.find();
//     res.status(200).json(items);
// };

// // Get a single item by ID
// export async function getitemById(req: Request, res: Response) {
//     const item = await Item.findById(req.params.id);
//     if (!item) {
//         res.status(404).json({ message: 'item not found' });
//         return;
//     }
//     res.status(200).json(item);
// };

// // Update a item by ID
// export async function updateitem(req: Request, res: Response) {
//     const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!item) {
//         res.status(404).json({ message: 'item not found' });
//         return;
//     }
//     res.status(200).json(item);
// };

// // Delete a item by ID
// export async function deleteItem(req: Request, res: Response) {
//     const item = await Item.findByIdAndDelete(req.params.id);
//     if (!item) {
//         res.status(404).json({ message: 'item not found' });
//         return;
//     }
//     res.status(200).json({ message: 'item deleted successfully' });
// };

