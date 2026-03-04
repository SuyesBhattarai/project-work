// Test file for admin controllerconst adminController = require("../Controller/Admin/adminController");

describe("Admin Controller", () => {

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("should return dashboard stats", async () => {

    const req = {
      app: {
        get: () => ({
          User: {
            findAll: jest.fn().mockResolvedValue([
              { role: "user" },
              { role: "hostel_owner" }
            ])
          }
        })
      }
    };

    const res = mockRes();

    await adminController.getStats(req, res);

    expect(res.json).toHaveBeenCalled();
  });

});