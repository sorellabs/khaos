describe('{} type.core', function() {
  var type = require('../src/type/core')
  var expect = require('expect.js')

  describe('λ is_p', function() {
    it('Should check for instanceof relationships when given a Function', function() {
      expect(type.is_p([], Array)).to.be.ok()
      expect(type.is_p([], Object)).to.be.ok()
      expect(type.is_p({}, Array)).to.not.be.ok() })

    it('Should check for the object in the [[Prototype]] chain when given an Object', function() {
      expect(type.is_p([], Array.prototype)).to.be.ok()
      expect(type.is_p([], Object.prototype)).to.be.ok()
      expect(type.is_p({}, Array.prototype)).to.not.be.ok() })
  })

  describe('λ name', function() {
    it('Should return the [[Class]] of the given subject', function() {
      expect(type.name([])).to.eql('Array')
      expect(type.name({})).to.eql('Object')
      expect(type.name(function(){})).to.eql('Function')
      expect(type.name(0)).to.eql('Number')
      expect(type.name(NaN)).to.eql('Number')
      expect(type.name('')).to.eql('String')
      expect(type.name(new Date)).to.eql('Date')
      expect(type.name(undefined)).to.eql('Undefined')
      expect(type.name(null)).to.eql('Null')
      expect(type.name(true)).to.eql('Boolean')
      expect(type.name(/re/)).to.eql('RegExp')
      expect(type.name(new Boolean(true))).to.eql('Boolean')
      expect(type.name(new String(''))).to.eql('String')
      expect(type.name(new Number(0))).to.eql('Number') })
  })

  describe('λ string_p', function() {
    it('Should check if the subject is-a plain String', function() {
      expect(type.string_p('')).to.be.ok()
      expect(type.string_p(new String(''))).to.be.ok()
      expect(type.string_p([''])).to.not.be.ok() })
  })

  describe('λ number_p', function() {
    it('Should check if the subject is-a plain Number', function() {
      expect(type.number_p(0)).to.be.ok()
      expect(type.number_p(NaN)).to.be.ok()
      expect(type.number_p('0')).to.not.be.ok() })
  })

  describe('λ date_p', function() {
    it('Should check if the subject is-a Date', function() {
      expect(type.date_p(new Date)).to.be.ok()
      expect(type.date_p(0)).to.not.be.ok() })
  })

  describe('λ regexp_p', function() {
    it('Should check if the subject is-a Regular Expression', function() {
      expect(type.regexp_p(/re/)).to.be.ok()
      expect(type.regexp_p(new RegExp('re'))).to.be.ok()
      expect(type.regexp_p('re')).to.not.be.ok() })
  })

  describe('λ fun_p', function() {
    it('Should check if the subject is-a Function', function() {
      expect(type.fun_p(function(){})).to.be.ok()
      expect(type.fun_p(new Function)).to.be.ok()
      expect(type.fun_p(/re/)).to.not.be.ok() })
  })

  describe('λ bool_p', function() {
    it('Should check if the subject is-a Boolean', function() {
      expect(type.bool_p(true)).to.be.ok()
      expect(type.bool_p(false)).to.be.ok()
      expect(type.bool_p(new Boolean(true))).to.be.ok()
      expect(type.bool_p(0)).to.not.be.ok() })
  })

  describe('λ object_p', function() {
    it('Should check if something is-a Object', function() {
      expect(type.object_p({})).to.be.ok()
      expect(type.object_p([])).to.not.be.ok()
      expect(type.object_p(null)).to.not.be.ok() })
  })

  describe('λ primitive_p', function() {
    it('Should check if something is a primitive', function() {
      expect(type.primitive_p(1)).to.be.ok()
      expect(type.primitive_p('')).to.be.ok()
      expect(type.primitive_p(false)).to.be.ok()
      expect(type.primitive_p(new Number(1))).to.not.be.ok() })
  })

  describe('λ undefined_p', function() {
    it('Should check if something is undefined', function() {
      expect(type.undefined_p(undefined)).to.be.ok()
      expect(type.undefined_p(null)).to.not.be.ok() })
  })
})




