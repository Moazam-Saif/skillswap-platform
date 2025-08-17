import React, { useState, useRef, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { closePopup } from '../store/popupSlice';
import { AuthContext } from '../context/AuthContext';
import { getUserById, setUserAvailability } from '../api/auth';

const WeekScheduler = () => {
    const dispatch = useDispatch();
    const { accessToken, user } = useContext(AuthContext);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [selectedDay, setSelectedDay] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [userTimezone, setUserTimezone] = useState('UTC');
    const [timeSlots, setTimeSlots] = useState({});
    const scrollRef = useRef(null);

    // Detect timezone and fetch existing availability on mount
useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(detectedTimezone);

    if (!user || !user._id) return;

    const fetchAvailability = async () => {
        try {
            const userData = await getUserById(user._id, accessToken);
            const slotsByDay = {};
            (userData.availability || []).forEach(slot => {
                // Use originalDay if present, otherwise fallback to day
                const day = slot.originalDay || slot.day;
                const start = slot.originalStartTime || slot.startTime;
                const end = slot.originalEndTime || slot.endTime;
                if (!slotsByDay[day]) slotsByDay[day] = [];
                slotsByDay[day].push({
                    start,
                    end,
                    id: slot.id
                });
            });
            setTimeSlots(slotsByDay);
        } catch (err) {
            console.error('Error fetching availability:', err);
        }
    };
    fetchAvailability();
}, [user?._id, accessToken]);

    const handleAddTime = () => {
        if (!startTime || !endTime || !selectedDay) return;

        setTimeSlots((prev) => {
            const updated = { ...prev };
            if (!updated[selectedDay]) updated[selectedDay] = [];
            updated[selectedDay].push({
                start: startTime,
                end: endTime,
                id: crypto.randomUUID()
            });
            return updated;
        });

        setStartTime('');
        setEndTime('');
    };

    const handleSaveAvailability = async () => {
        try {
            const availability = [];
            Object.entries(timeSlots).forEach(([day, slots]) => {
                if (slots && slots.length > 0) {
                    slots.forEach(slot => {
                        availability.push({
                            day: day,
                            startTime: slot.start,
                            endTime: slot.end,
                            id: slot.id
                        });
                    });
                }
            });

            if (availability.length === 0) {
                alert('Please add at least one time slot');
                return;
            }

            const availabilityData = {
                availability,
                timezone: userTimezone
            };

            const response = await setUserAvailability(availabilityData, accessToken);
            alert('Availability saved successfully!');
            dispatch(closePopup());
        } catch (error) {
            alert('Failed to save availability. Please try again.');
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [timeSlots]);

    return (
        <>
            <div className="p-4 sm:p-6 max-w-2xl mx-auto">
                <div className="mb-4 text-center">
                    <p className="text-sm text-gray-600">
                        Your timezone: <span className="font-medium">{userTimezone}</span>
                    </p>
                </div>

                <div className="flex flex-wrap justify-evenly bg-[rgb(255,255,255,0.7)] p-4 rounded-lg shadow-md mb-4 gap-y-2 sm:gap-3">
                    {daysOfWeek.map((day) => (
                        <div
                            key={day}
                            className={`px-3 py-1 rounded-md text-sm cursor-pointer font-medium transition ${selectedDay === day ? 'bg-[rgb(231,111,81)] text-white' : 'bg-[rgb(231,111,81,0.6)] text-white'
                                }`}
                            onClick={() => setSelectedDay(day)}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {selectedDay && (
                    <div className="bg-[rgb(255,255,255,0.7)] border p-4 rounded-md shadow-sm mb-4">
                        <h3 className="text-lg font-semibold mb-3">{selectedDay} - Add Time Slot</h3>
                        <div className="flex flex-col sm:flex-row sm:items-end gap-y-4 gap-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium">Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full border px-2 py-1 rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium">End Time</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full border px-2 py-1 rounded-md"
                                />
                            </div>
                            <button
                                onClick={handleAddTime}
                                className="bg-[#E76F51] text-white w-full sm:w-auto px-4 py-2 rounded-md cursor-pointer"
                            >
                                Add Time
                            </button>
                        </div>
                    </div>
                )}

                <div
                    ref={scrollRef}
                    className="bg-[rgb(255,255,255,0.7)] border p-4 rounded-md shadow-sm overflow-y-auto max-h-30"
                >
                    {Object.values(timeSlots).every((slots) => !slots || slots.length === 0) ? (
                        <div className="text-sm text-gray-600">No timeslot selected</div>
                    ) : (
                        daysOfWeek.map((day) => {
                            const slots = timeSlots[day];
                            if (!slots || slots.length === 0) return null;

                            return (
                                <div key={day} className="text-sm text-black mb-2">
                                    <span className="font-bold">{day}:</span>{' '}
                                    {slots.map((slot, index) => (
                                        <span key={slot.id || index} className="inline-flex items-center mr-2 bg-gray-200 px-2 py-0.5 rounded-md">
                                            {slot.start}-{slot.end}
                                            <button
                                                onClick={() => {
                                                    setTimeSlots((prev) => {
                                                        const updated = { ...prev };
                                                        updated[day] = updated[day].filter((_, i) => i !== index);
                                                        if (updated[day].length === 0) delete updated[day];
                                                        return updated;
                                                    });
                                                }}
                                                className="ml-1 text-red-500 hover:text-red-700 font-bold"
                                                title="Delete"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
                    <button
                        onClick={handleSaveAvailability}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    >
                        Save Availability
                    </button>
                    <button
                        onClick={() => dispatch(closePopup())}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};

export default WeekScheduler;