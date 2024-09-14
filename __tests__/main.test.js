"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
describe("Timeout Proxy", () => {
    beforeEach(() => {
        jest.useFakeTimers({
            advanceTimers: true,
        });
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    test("should confirm if setTimeout is being called", () => {
        const p = new index_1.TinyProxy({
            shouldLog: true,
        });
        p.setupTimerProxy();
        const spySetTimeout = jest.spyOn(global, "setTimeout");
        const timerId = setTimeout(() => { }, 100);
        // Check if setTimeout was called and got the correct ID
        expect(spySetTimeout).toHaveBeenCalledTimes(1);
        expect(spySetTimeout).toHaveBeenCalledWith(expect.any(Function), 100);
        // Advance timers
        jest.advanceTimersByTime(100);
        // Verify the timer is in the activeTimeouts
        expect(p.activeTimeouts.has(timerId)).toBe(true);
        expect(p.activeTimeouts.size).toBe(1);
    });
    test("should confirm if clearTimeout is being called", () => {
        const p = new index_1.TinyProxy({
            shouldLog: true,
        });
        p.setupTimerProxy();
        const spyClearTimeout = jest.spyOn(global, "clearTimeout");
        const timerId = setTimeout(() => { }, 100);
        expect(spyClearTimeout).toHaveBeenCalledTimes(0);
        // Advance timers
        jest.advanceTimersByTime(100);
        // Verify the timer is in the activeTimeouts
        expect(p.activeTimeouts.has(timerId)).toBe(true);
        expect(p.activeTimeouts.size).toBe(1);
        clearTimeout(timerId);
        expect(p.activeTimeouts.has(timerId)).toBe(false);
        expect(p.activeTimeouts.size).toBe(0);
    });
});
