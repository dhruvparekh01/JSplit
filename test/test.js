var assert = require("assert");

describe("Array", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe("Basic Mocha String Test", function() {
  it("should return number of charachters in a string", function() {
    assert.equal("Hello".length, 5);
  });
  it("should return first charachter of the string", function() {
    assert.equal("Hello".charAt(0), "H");
  });
});

describe("Jimbob is the best Bob", function() {
  it("should return yes", function() {
    assert.equal("yes", "yes");
  });
});
