jest.mock("../Model/Hostel");

const Hostel = require("../Model/Hostel");
const hostelController = require("../Controller/Hostel/hostelController");

describe("Hostel Controller", () => {

  test("getAllHostels should return hostels", async () => {

    Hostel.findAll.mockResolvedValue([{ id: 1, name: "Test Hostel" }]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await hostelController.getAllHostels(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

});