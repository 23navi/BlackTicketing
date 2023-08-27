import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // create an instance of a ticket

  const ticket = Ticket.build({
    price: 50,
    title: "test_ticket",
    userId: "123",
  });

  // save it to db

  await ticket.save();

  // fetch the ticket twice * ticket 1 and ticket 2 -> both being the same instance of ticket

  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);

  // Make a change to first ticket

  ticket1!.set({ price: 10 });

  // save the first ticket -> should work fine and update the version number
  await ticket1?.save();

  console.log({ ticket1 });

  // Make a change to second ticket

  ticket2!.set({ price: 15 });

  // save the second ticket -> should fail because the version number is different
  // expect(async () => {
  //   console.log(await ticket2?.save());
  // }).toThrow();

  try {
    await ticket2?.save();
  } catch (err) {
    return;
  }
  throw new Error("Should not reach this point");
});
