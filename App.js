import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, ChevronUp, Dumbbell, CheckCircle, ArrowLeft, TrendingUp, BarChart2, Zap, Search, Sun, Moon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- DEMO DATA: 8-Week Program ---

const programSchedule = [
    ...[1,2,3,4,5,6,7,8].flatMap(week => [
        { "Week": week, "Day": "Mon", "AM": "AM: HIIT Sprints", "PM": "PM: Lower Body A (Quad Focus)" },
        { "Week": week, "Day": "Tue", "AM": null, "PM": "PM: Upper Body A (Push/Pull)" },
        { "Week": week, "Day": "Wed", "AM": "AM: Steady-State Cardio", "PM": "PM: Lower Body B (Hinge Focus)" },
        { "Week": week, "Day": "Thu", "AM": null, "PM": "REST" },
        { "Week": week, "Day": "Fri", "AM": null, "PM": "PM: Upper Body B (Arms/Shoulders)" },
        { "Week": week, "Day": "Sat", "AM": null, "PM": "PM: Accessory & Weak Point" },
        { "Week": week, "Day": "Sun", "AM": "REST", "PM": "REST" },
    ])
];

const programPlan = [
    { "DayName": "PM: Lower Body A (Quad Focus)", "Exercise": "Compound Quad Focus (e.g., Squat)", "Sets": 4, "Rep Range": "5-8", "Notes": "Focus on depth", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Lower Body A (Quad Focus)", "Exercise": "Accessory Quad Focus (e.g., Leg Press)", "Sets": 3, "Rep Range": "8-12", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Lower Body A (Quad Focus)", "Exercise": "Isolation Quad Focus (e.g., Leg Extension)", "Sets": 3, "Rep Range": "10-15", "Notes": "Squeeze at peak", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Lower Body A (Quad Focus)", "Exercise": "Accessory Glute Focus (e.g., Lunge)", "Sets": 3, "Rep Range": "8-12", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Lower Body A (Quad Focus)", "Exercise": "Isolation Calves (e.g., Calf Raise)", "Sets": 4, "Rep Range": "10-15", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body A (Push/Pull)", "Exercise": "Compound Horizontal Push (e.g., Bench Press)", "Sets": 4, "Rep Range": "5-8", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body A (Push/Pull)", "Exercise": "Compound Vertical Pull (e.g., Pull-up)", "Sets": 4, "Rep Range": "6-10", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body A (Push/Pull)", "Exercise": "Accessory Shoulders (e.g., OHP)", "Sets": 3, "Rep Range": "8-12", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body A (Push/Pull)", "Exercise": "Accessory Chest (e.g., Incline DB Press)", "Sets": 3, "Rep Range": "8-12", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body A (Push/Pull)", "Exercise": "Accessory Back (e.g., DB Row)", "Sets": 3, "Rep Range": "8-12", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Lower Body B (Hinge Focus)", "Exercise": "Compound Hinge (e.g., Deadlift)", "Sets": 4, "Rep Range": "4-6", "Notes": "Flat back", "Last Set = Failure": "No", "Other Sets RIR": "2-3 RIR" },
    { "DayName": "PM: Lower Body B (Hinge Focus)", "Exercise": "Accessory Hamstring Focus (e.g., RDL)", "Sets": 3, "Rep Range": "8-12", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Lower Body B (Hinge Focus)", "Exercise": "Isolation Hamstrings (e.g., Leg Curl)", "Sets": 3, "Rep Range": "10-15", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Lower Body B (Hinge Focus)", "Exercise": "Accessory Glutes (e.g., Hip Thrust)", "Sets": 3, "Rep Range": "8-12", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Lower Body B (Hinge Focus)", "Exercise": "Accessory Core (e.g., Leg Raise)", "Sets": 3, "Rep Range": "15-20", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body B (Arms/Shoulders)", "Exercise": "Compound Vertical Push (e.g., OHP)", "Sets": 4, "Rep Range": "5-8", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body B (Arms/Shoulders)", "Exercise": "Compound Horizontal Pull (e.g., Barbell Row)", "Sets": 4, "Rep Range": "6-10", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body B (Arms/Shoulders)", "Exercise": "Accessory Shoulders (e.g., Lateral Raise)", "Sets": 3, "Rep Range": "12-15", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body B (Arms/Shoulders)", "Exercise": "Accessory Biceps (e.g., Preacher Curl)", "Sets": 3, "Rep Range": "10-12", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Upper Body B (Arms/Shoulders)", "Exercise": "Accessory Triceps (e.g., Skullcrusher)", "Sets": 3, "Rep Range": "10-12", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Accessory & Weak Point", "Exercise": "Isolation Biceps (e.g., Concentration Curl)", "Sets": 3, "Rep Range": "12-15", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Accessory & Weak Point", "Exercise": "Isolation Triceps (e.g., Rope Pushdown)", "Sets": 3, "Rep Range": "12-15", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Accessory & Weak Point", "Exercise": "Isolation Rear Delts (e.g., Face Pull)", "Sets": 3, "Rep Range": "15-20", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Accessory & Weak Point", "Exercise": "Isolation Chest (e.g., Pec Deck)", "Sets": 3, "Rep Range": "12-15", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" },
    { "DayName": "PM: Accessory & Weak Point", "Exercise": "Isolation Back Width (e.g., Straight Arm Pulldown)", "Sets": 3, "Rep Range": "12-15", "Notes": "", "Last Set = Failure": "Yes", "Other Sets RIR": "1-2 RIR" }
];

const programCardio = [
    { "SessionName": "AM: HIIT Sprints", "Mode": "High-Intensity Interval Training", "Work Prescription": "8 rounds of 30s max effort", "Recovery": "60s light recovery between rounds", "Notes": "Recommended on Rower or Assault Bike" },
    { "SessionName": "AM: Steady-State Cardio", "Mode": "Low-Intensity Steady-State", "Work Prescription": "30-45 minutes continuous effort", "Recovery": "N/A", "Notes": "Maintain a conversational pace (Zone 2 HR)" },
];

const generateDemoLogs = () => {
    const logs = {};
    const baseWeights = {
        "Compound Quad Focus (e.g., Squat)": 135, "Accessory Quad Focus (e.g., Leg Press)": 270, "Isolation Quad Focus (e.g., Leg Extension)": 80, "Accessory Glute Focus (e.g., Lunge)": 30, "Isolation Calves (e.g., Calf Raise)": 150, "Compound Horizontal Push (e.g., Bench Press)": 155, "Compound Vertical Pull (e.g., Pull-up)": 0, "Accessory Shoulders (e.g., OHP)": 75, "Accessory Chest (e.g., Incline DB Press)": 50, "Accessory Back (e.g., DB Row)": 60, "Compound Hinge (e.g., Deadlift)": 225, "Accessory Hamstring Focus (e.g., RDL)": 115, "Isolation Hamstrings (e.g., Leg Curl)": 90, "Accessory Glutes (e.g., Hip Thrust)": 185, "Accessory Core (e.g., Leg Raise)": 0, "Compound Vertical Push (e.g., OHP)": 85, "Compound Horizontal Pull (e.g., Barbell Row)": 135, "Accessory Shoulders (e.g., Lateral Raise)": 15, "Accessory Biceps (e.g., Preacher Curl)": 40, "Accessory Triceps (e.g., Skullcrusher)": 50, "Isolation Biceps (e.g., Concentration Curl)": 20, "Isolation Triceps (e.g., Rope Pushdown)": 60, "Isolation Rear Delts (e.g., Face Pull)": 40, "Isolation Chest (e.g., Pec Deck)": 100, "Isolation Back Width (e.g., Straight Arm Pulldown)": 70
    };

    for (let week = 1; week <= 4; week++) {
        programSchedule.filter(s => s.Week === week).forEach(day => {
            if (day.PM !== 'REST') {
                const exercises = programPlan.filter(ex => ex.DayName === day.PM);
                exercises.forEach(ex => {
                    const baseWeight = baseWeights[ex.Exercise] || 50;
                    const weeklyIncrease = ex.Exercise.includes("Compound") ? 5 : 2.5;
                    const currentWeight = baseWeight + ((week - 1) * weeklyIncrease);
                    const [minRep, maxRep] = ex["Rep Range"].split('-').map(Number);

                    for (let set = 1; set <= ex.Sets; set++) {
                        const logId = `${week}-${day.Day}-${ex.Exercise}-${set}`;
                        const isLastSet = set === ex.Sets && ex["Last Set = Failure"] === "Yes";
                        const reps = isLastSet ? maxRep + Math.floor(Math.random() * 2) : minRep + Math.floor(Math.random() * (maxRep - minRep + 1));
                        logs[logId] = { week, dayKey: day.Day, session: day.PM, exercise: ex.Exercise, set, load: currentWeight, reps, type: 'lifting' };
                    }
                });
            }
            if (day.AM && day.AM !== 'REST') {
                const logId = `${week}-${day.Day}-cardio`;
                if (day.AM.includes("HIIT")) {
                    logs[logId] = { metric1: `${8 + week -1} rounds`, metric2: `${8 + Math.ceil(Math.random()*2)} RPE`, notes: "Felt strong today.", week, dayKey: day.Day, type: 'cardio', session: day.AM };
                } else {
                    logs[logId] = { metric1: `${30 + (week-1)*5} min`, metric2: `${135 + (week-1)*2} avg HR`, notes: "Kept it steady.", week, dayKey: day.Day, type: 'cardio', session: day.AM };
                }
            }
        });
    }
    return logs;
};

// --- Helper Functions ---
const calculateE1RM = (weight, reps) => {
    if (reps == 1) return weight;
    if (reps < 1 || !weight) return 0;
    return parseFloat(weight) * (1 + parseFloat(reps) / 30);
};

// --- Components ---

const SetRow = ({ set, logData, onLogChange }) => {
    return (
        <div className="grid grid-cols-5 gap-2 items-center py-2 px-3 bg-gray-700/50 rounded-md">
            <div className="text-sm font-bold text-gray-200">Set {set.number}</div>
            <div className="text-sm text-center text-gray-400">{set.reps}</div>
            <div className="text-sm text-center font-medium text-blue-400">{set.effort}</div>
            <div>
                <input type="number" placeholder="kg/lbs" value={logData.load || ''} onChange={(e) => onLogChange(set.number, 'load', e.target.value)} className="w-full p-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <input type="number" placeholder="Reps" value={logData.reps || ''} onChange={(e) => onLogChange(set.number, 'reps', e.target.value)} className="w-full p-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
        </div>
    );
};

const ExerciseCard = ({ exercise, logs, onLogChange, week, dayKey }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const sets = Array.from({ length: exercise.Sets }, (_, i) => i + 1);
    
    const isCompleted = sets.every(setNum => {
        const log = logs[`${week}-${dayKey}-${exercise.Exercise}-${setNum}`];
        return log && log.load && log.reps;
    });

    return (
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 text-left flex justify-between items-center bg-gray-700/50 hover:bg-gray-700">
                <div>
                    <h3 className="text-lg font-semibold text-white">{exercise.Exercise}</h3>
                    <p className="text-sm text-gray-400">
                        {exercise.Sets} sets x {exercise['Rep Range']}
                        {exercise.Notes && ` (${exercise.Notes})`}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    {isCompleted && <CheckCircle className="text-green-500" size={20} />}
                    {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                </div>
            </button>
            {isOpen && (
                <div className="p-4 overflow-x-auto">
                    <div className="grid grid-cols-5 gap-2 mb-2 px-3 text-xs font-medium text-gray-400 min-w-[400px]">
                        <span></span>
                        <span className="text-center">Target Reps</span>
                        <span className="text-center">Target Effort (RIR)</span>
                        <span className="text-center">Load</span>
                        <span className="text-center">Reps</span>
                    </div>
                    <div className="space-y-2 min-w-[400px]">
                        {sets.map((setNumber) => {
                            const isLastSet = setNumber === exercise.Sets;
                            const effortText = isLastSet && exercise['Last Set = Failure'] === 'Yes' ? "Failure" : exercise['Other Sets RIR'];
                            const logKey = `${week}-${dayKey}-${exercise.Exercise}-${setNumber}`;
                            return <SetRow key={setNumber} set={{ number: setNumber, reps: exercise['Rep Range'], effort: effortText }} logData={logs[logKey] || {}} onLogChange={(setNum, field, val) => onLogChange(exercise.Exercise, setNum, field, val)} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const LiftingSession = ({ sessionName, week, dayKey, onBack, allLogs, setAllLogs }) => {
    const exercises = React.useMemo(() => programPlan.filter(e => e.DayName === sessionName), [sessionName]);
    const sessionLogs = React.useMemo(() => {
        const relevantLogs = {};
        Object.entries(allLogs).forEach(([key, value]) => {
            if (key.startsWith(`${week}-${dayKey}`) && value.type === 'lifting') {
                relevantLogs[key] = value;
            }
        });
        return relevantLogs;
    }, [allLogs, week, dayKey]);

    const handleLogChange = (exerciseName, setNumber, field, value) => {
        const logId = `${week}-${dayKey}-${exerciseName}-${setNumber}`;
        const newLogs = { ...allLogs };
        if (!newLogs[logId]) {
            newLogs[logId] = { week, dayKey, session: sessionName, exercise: exerciseName, set: setNumber, type: 'lifting' };
        }
        newLogs[logId][field] = value;
        setAllLogs(newLogs);
    };
    
    const completedExercises = exercises.filter(ex => Array.from({ length: ex.Sets }, (_, i) => i + 1).every(setNum => sessionLogs[`${week}-${dayKey}-${ex.Exercise}-${setNum}`]?.load && sessionLogs[`${week}-${dayKey}-${ex.Exercise}-${setNum}`]?.reps)).length;
    const progress = exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0;

    return (
        <div className="p-4 md:p-6 pb-24">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-blue-400 hover:underline mb-4">
                <ArrowLeft size={16} className="mr-1" /> Back to Main
            </button>
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Week {week}: {dayKey} (PM)</h2>
                <p className="text-md text-gray-400">{sessionName.replace('PM: ', '')}</p>
            </div>
            <div className="mb-6">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-1">{completedExercises} of {exercises.length} exercises complete</p>
            </div>
            <div className="space-y-4">
                {exercises.map(exercise => <ExerciseCard key={exercise.Exercise} exercise={exercise} logs={sessionLogs} onLogChange={handleLogChange} week={week} dayKey={dayKey} />)}
            </div>
        </div>
    );
};

const CardioSession = ({ sessionName, week, dayKey, onBack, allLogs, setAllLogs }) => {
    const logId = `${week}-${dayKey}-cardio`;
    const log = allLogs[logId] || {};
    const cardioTarget = programCardio.find(s => s.SessionName === sessionName);

    const handleLogChange = (field, value) => {
        const newLogs = { ...allLogs };
        if (!newLogs[logId]) {
            newLogs[logId] = { week, dayKey, session: sessionName, type: 'cardio' };
        }
        newLogs[logId][field] = value;
        setAllLogs(newLogs);
    };

    const isCompleted = log.metric1 && log.metric2;

    return (
        <div className="p-4 md:p-6 pb-24">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-blue-400 hover:underline mb-4">
                <ArrowLeft size={16} className="mr-1" /> Back to Main
            </button>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Week {week}: {dayKey} (AM)</h2>
                    <p className="text-md text-gray-400">{cardioTarget?.Mode || 'Cardio / Conditioning'}</p>
                </div>
                {isCompleted && <CheckCircle className="text-green-500" size={32} />}
            </div>
            <div className="bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
                {cardioTarget && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Prescription</h3>
                        <div className="bg-gray-700 p-4 rounded-lg space-y-2">
                            <p><strong className="font-semibold text-white">Work:</strong> <span className="text-gray-300">{cardioTarget['Work Prescription']}</span></p>
                            <p><strong className="font-semibold text-white">Recovery:</strong> <span className="text-gray-300">{cardioTarget.Recovery}</span></p>
                            {cardioTarget.Notes && <p className="text-sm italic text-gray-400">Note: {cardioTarget.Notes}</p>}
                        </div>
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Log Your Session</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Metric 1 (e.g., Duration/Intervals)</label>
                            <input type="text" value={log.metric1 || ''} onChange={e => handleLogChange('metric1', e.target.value)} className="w-full p-2 text-sm bg-gray-900 border border-gray-600 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Metric 2 (e.g., Distance/RPE)</label>
                            <input type="text" value={log.metric2 || ''} onChange={e => handleLogChange('metric2', e.target.value)} className="w-full p-2 text-sm bg-gray-900 border border-gray-600 rounded-md"/>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                            <textarea value={log.notes || ''} onChange={e => handleLogChange('notes', e.target.value)} className="w-full p-2 text-sm bg-gray-900 border border-gray-600 rounded-md" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardView = ({ onBack, allLogs }) => {
    const [selectedExercise, setSelectedExercise] = React.useState('');
    const [searchTerm, setSearchTerm] = React.useState('');
    const searchInputRef = React.useRef(null);
    
    const uniqueExercises = React.useMemo(() => Array.from(new Set(programPlan.map(e => e.Exercise))).sort(), []);

    React.useEffect(() => {
        if (uniqueExercises.length > 0 && !selectedExercise) setSelectedExercise(uniqueExercises[0]);
    }, [uniqueExercises, selectedExercise]);
    
    const filteredExercises = React.useMemo(() => searchTerm ? uniqueExercises.filter(ex => ex.toLowerCase().includes(searchTerm.toLowerCase())) : uniqueExercises, [searchTerm, uniqueExercises]);

    const chartData = React.useMemo(() => {
        if (!selectedExercise || !allLogs) return [];
        const exerciseLogs = Object.values(allLogs).filter(log => log.type === 'lifting' && log.exercise === selectedExercise && log.load && log.reps);
        const dataBySession = exerciseLogs.reduce((acc, log) => {
            const sessionKey = `W${log.week}-${log.dayKey}`;
            if (!acc[sessionKey]) acc[sessionKey] = { week: log.week, dayKey: log.dayKey, sessionKey, topE1RM: 0, topLoad: 0, topSet: null };
            const e1rm = calculateE1RM(log.load, log.reps);
            if (e1rm > acc[sessionKey].topE1RM) acc[sessionKey].topE1RM = e1rm;
            const currentLoad = parseFloat(log.load);
            if (currentLoad > acc[sessionKey].topLoad) {
                acc[sessionKey].topLoad = currentLoad;
                acc[sessionKey].topSet = { reps: parseInt(log.reps), load: currentLoad };
            }
            return acc;
        }, {});
        return Object.values(dataBySession).sort((a, b) => a.week - b.week || a.dayKey.localeCompare(b.dayKey)).map(d => ({ sessionKey: d.sessionKey, e1RM: Math.round(d.topE1RM), load: d.topSet?.load || 0, reps: d.topSet?.reps || 0 }));
    }, [selectedExercise, allLogs]);

    const ChartWrapper = ({ title, children, data }) => (
        <div className="bg-gray-800 rounded-xl shadow-md p-4 h-96">
            <h3 className="font-semibold text-gray-200 mb-4">{title}</h3>
            {data.length > 1 ? <ResponsiveContainer width="100%" height="90%">{children}</ResponsiveContainer> : <div className="flex items-center justify-center h-full text-gray-400"><p>Not enough data for a chart.</p></div>}
        </div>
    );

    return (
        <div className="p-4 md:p-6 pb-24">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-blue-400 hover:underline mb-4"><ArrowLeft size={16} className="mr-1" /> Back to Main</button>
            <div className="flex items-center mb-6"><TrendingUp className="text-blue-400 mr-3" size={32} /><div><h1 className="text-2xl md:text-3xl font-bold text-white">Progress Dashboard</h1><p className="text-md text-gray-400">Visualize your strength gains.</p></div></div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Search for Exercise:</label>
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input ref={searchInputRef} type="text" placeholder="e.g., Compound Lower 1" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} inputMode="search" className="w-full p-2 pl-10 bg-gray-800 border border-gray-600 rounded-md shadow-sm"/></div>
                
                <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-700 bg-gray-800">
                    {filteredExercises.map(ex => (
                        <button key={ex} onClick={() => { setSelectedExercise(ex); setSearchTerm(''); }} className={`w-full text-left p-2 text-sm ${selectedExercise === ex ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-700'}`}>
                            {ex}
                        </button>
                    ))}
                </div>
            </div>
            <h2 className="text-xl font-bold text-gray-200 my-4 text-center">{selectedExercise}</h2>
            <div className="space-y-8">
                <ChartWrapper title="Top Set Load Progression" data={chartData}><LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="sessionKey" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12, fill: '#A0AEC0' }} /><YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12, fill: '#A0AEC0' }} /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4B5563', borderRadius: '0.5rem' }}/><Legend wrapperStyle={{color: '#E2E8F0' }}/><Line type="monotone" dataKey="load" name="Top Set Load" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ChartWrapper>
                <ChartWrapper title="Top Set Reps vs. Load" data={chartData}><LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="sessionKey" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12, fill: '#A0AEC0' }} /><YAxis yAxisId="left" domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#8884d8"/><YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 5']} tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#82ca9d"/><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4B5563', borderRadius: '0.5rem' }}/><Legend wrapperStyle={{color: '#E2E8F0' }}/><Line yAxisId="left" type="monotone" dataKey="load" name="Load" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} /><Line yAxisId="right" type="monotone" dataKey="reps" name="Reps" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ChartWrapper>
                <ChartWrapper title="Estimated 1-Rep Max (e1RM) Progression" data={chartData}><LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="sessionKey" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12, fill: '#A0AEC0' }} /><YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 12, fill: '#A0AEC0' }} /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4B5563', borderRadius: '0.5rem' }}/><Legend wrapperStyle={{color: '#E2E8F0' }}/><Line type="monotone" dataKey="e1RM" name="e1RM" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ChartWrapper>
            </div>
        </div>
    );
};

const WeekView = ({ week, completedDays, onSessionSelect }) => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const isWeekComplete = useMemo(() => {
        return daysOfWeek.every(day => {
            const dayData = programSchedule.find(d => d.Week === week && d.Day === day);
            if (!dayData || dayData.PM === 'REST') return true;
            const status = completedDays.get(`${week}-${day}`);
            return status?.isDayComplete;
        });
    }, [week, completedDays]);

    const [isOpen, setIsOpen] = useState(!isWeekComplete);

    useEffect(() => {
        setIsOpen(!isWeekComplete);
    }, [isWeekComplete]);

    const getDayBgColor = (status, isRestDay) => {
        if (isRestDay) return 'bg-indigo-900/50';
        if (!status) return 'bg-gray-800';
        if (status.isDayComplete) return 'bg-green-900/50 ring-2 ring-green-500';
        if (status.am || status.pm) return 'bg-yellow-900/50 ring-2 ring-yellow-500';
        return 'bg-gray-800';
    };

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left p-2">
                <h3 className="text-lg font-semibold text-gray-200">Week {week}</h3>
                <div className="flex items-center gap-2">
                    {isWeekComplete && <CheckCircle className="text-green-500" />}
                    {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                </div>
            </button>
            {isOpen && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3 mt-3">
                    {daysOfWeek.map(day => {
                        const dayData = programSchedule.find(d => d.Week === week && d.Day === day);
                        if (!dayData) return null;
                        const dayKey = `${week}-${day}`;
                        const status = completedDays.get(dayKey);
                        const isRestDay = (dayData.PM === 'REST') && (dayData.AM === 'REST' || dayData.AM === null);
                        return (
                            <div key={dayKey} className={`rounded-lg shadow-sm p-2 flex flex-col justify-between ${getDayBgColor(status, isRestDay)}`}>
                                <div className="font-bold text-sm text-gray-200 mb-2">{day}</div>
                                <div className="space-y-2">
                                    {dayData.AM && dayData.AM !== 'REST' ? (<button onClick={() => onSessionSelect(week, day, 'cardio', dayData.AM)} className={`w-full flex items-center justify-between text-xs p-1.5 rounded ${status?.am ? 'bg-green-800/60' : 'bg-gray-700 hover:bg-gray-600'}`}><div className="flex items-center gap-1"><Sun size={12} className="text-yellow-500"/> AM</div>{status?.am ? <CheckCircle size={14} className="text-green-600"/> : <Zap size={14} className="text-orange-500"/>}</button>) : <div className="h-7"></div>}
                                    {dayData.PM && dayData.PM !== 'REST' ? (<button onClick={() => onSessionSelect(week, day, 'lifting', dayData.PM)} className={`w-full flex items-center justify-between text-xs p-1.5 rounded ${status?.pm ? 'bg-green-800/60' : 'bg-gray-700 hover:bg-gray-600'}`}><div className="flex items-center gap-1"><Moon size={12} className="text-indigo-400"/> PM</div>{status?.pm ? <CheckCircle size={14} className="text-green-600"/> : <Dumbbell size={14} className="text-blue-500"/>}</button>) : <div className="text-center text-xs text-indigo-300 p-1.5 font-semibold">REST</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const MainView = ({ onSessionSelect, onNavChange, completedDays }) => {
    const weeks = [...new Set(programSchedule.map(d => d.Week))];
    
    return (
        <div className="p-2 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div className="flex items-center"><Dumbbell className="text-blue-400 mr-3 flex-shrink-0" size={32} /><div><h1 className="text-2xl md:text-3xl font-bold text-white">Welcome, Demo Client!</h1><p className="text-md text-gray-400">Your Custom Training Program</p></div></div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => onNavChange('dashboard')} className="flex-shrink-0 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"><BarChart2 size={16} /> Dashboard</button>
                </div>
            </div>
            <div className="space-y-6 pb-24">
                {weeks.map(week => (
                    <WeekView key={week} week={week} completedDays={completedDays} onSessionSelect={onSessionSelect} />
                ))}
            </div>
        </div>
    );
};

// --- App Structure & Routing ---

const App = () => {
    const [pageState, setPageState] = useState({ view: 'main', data: {} });
    const [allLogs, setAllLogs] = useState({});

    useEffect(() => {
        try {
            const savedLogs = localStorage.getItem('demoWorkoutLogs');
            if (savedLogs) {
                setAllLogs(JSON.parse(savedLogs));
            } else {
                setAllLogs(generateDemoLogs());
            }
        } catch (error) {
            console.error("Could not load logs from local storage", error);
            setAllLogs(generateDemoLogs());
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('demoWorkoutLogs', JSON.stringify(allLogs));
        } catch (error) {
            console.error("Could not save logs to local storage", error);
        }
    }, [allLogs]);

    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state) {
                setPageState(event.state);
            } else {
                setPageState({ view: 'main', data: {} });
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = (view, data = {}) => {
        const newPageState = { view, data };
        const url = `#${view}`;
        window.history.pushState(newPageState, '', url);
        setPageState(newPageState);
    };
    
    const onBack = () => {
        window.history.back();
    };

    const completedDays = useMemo(() => {
        const completionStatus = new Map();
        programSchedule.forEach(dayInfo => {
            const dayKey = `${dayInfo.Week}-${dayInfo.Day}`;
            const amScheduled = dayInfo.AM && dayInfo.AM !== 'REST';
            const pmScheduled = dayInfo.PM && dayInfo.PM !== 'REST';
            
            let amComplete = false;
            if (amScheduled) {
                const cardioLog = allLogs[`${dayKey}-cardio`];
                amComplete = cardioLog && cardioLog.metric1 && cardioLog.metric2;
            }

            let pmComplete = false;
            if (pmScheduled) {
                const exercisesForDay = programPlan.filter(e => e.DayName === dayInfo.PM);
                if (exercisesForDay.length > 0) {
                    pmComplete = exercisesForDay.every(ex => Array.from({ length: ex.Sets }, (_, i) => i + 1).every(setNum => {
                        const log = allLogs[`${dayKey}-${ex.Exercise}-${setNum}`];
                        return log && log.load && log.reps;
                    }));
                }
            }
            completionStatus.set(dayKey, { am: amComplete, pm: pmComplete, isDayComplete: (!amScheduled || amComplete) && (!pmScheduled || pmComplete) });
        });
        return completionStatus;
    }, [allLogs]);

    const renderContent = () => {
        const { view, data } = pageState;
        switch(view) {
            case 'lifting': return <LiftingSession {...data} onBack={onBack} allLogs={allLogs} setAllLogs={setAllLogs} />;
            case 'cardio': return <CardioSession {...data} onBack={onBack} allLogs={allLogs} setAllLogs={setAllLogs} />;
            case 'dashboard': return <DashboardView onBack={onBack} allLogs={allLogs} />;
            default: return <MainView onSessionSelect={(week, day, type, name) => navigate(type, { week, dayKey: day, sessionName: name })} onNavChange={(v) => navigate(v)} completedDays={completedDays} />;
        }
    };
    
    return (
        <div className="bg-gray-900 min-h-screen font-sans text-gray-100">
            <div className="container mx-auto max-w-7xl">
                {renderContent()}
            </div>
        </div>
    );
}

// Simple wrapper to apply the 'dark' class to the html element
export default function AppWrapper() {
    useEffect(() => {
        document.documentElement.classList.add('dark');
        // Optional: remove the class on component unmount
        return () => {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return <App />;
}
