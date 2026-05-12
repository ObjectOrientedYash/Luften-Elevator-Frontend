import {useState, useEffect} from 'react';
import {jsPDF} from 'jspdf';
import styles from './LiftForm.module.css';

const Section = ({title, children}) => (
    <div className={styles.section}>
        <div className={styles.sectionTitle}>{title}</div>
        <div className={styles.sectionBody}>{children}</div>
    </div>
);

const Field = ({label, half, children}) => (
    <div className={half ? styles.fieldHalf : styles.fieldFull}>
        <label className={styles.fieldLabel}>{label}</label>
        {children}
    </div>
);

const CheckItem = ({label, checked, onChange}) => (
    <label className={styles.checkItem}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span>{label}</span>
    </label>
);

const INIT = {
    date: '',
    clientName: '',
    contactName: '',
    mobile: '',
    projectName: '',
    projectAddress: '',
    group: '',
    liftType: '',
    numUnits: '',
    doorOperation: '',
    passengers: '',
    operations: '',
    speed: '',
    floors: '',
    noOfOpening: '',
    machineRoom: '',
    doorWidth: '',
    doorHeight: '',
    shaftWidth: '',
    shaftDepth: '',
    shaftDetails: '',
    carDoorType: '',
    carDoorFinish: '',
    landingDoorType: '',
    landingDoorFinish: '',
    doorFrameLocation: '',
    carPanels: '',
    falseCeiling: '',
    carVentilation: '',
    flooring: '',
    handrail: '',
    handrailLocation: '',
    lopCop: '',
    displayCop: '',
    autoRescue: false,
    overload: false,
    onOffKey: false,
    mobileOperated: false,
    rfid: false,
    emergency5call: false,
    siteReadiness: false,
    logo: false,
    liftDesc: '',
    basicCost: '',
    taxesPer: '',
    costWithTax: '',
    totalAmount: '',
    note: ''
};

export default function LiftForm() {
    const [form, setForm] = useState({...INIT});

    const set = key => e => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setForm(f => ({
            ...f,
            [key]: val
        }));
    };

    useEffect(() => {
        const bc = parseFloat(form.basicCost) || 0;
        const tx = parseFloat(form.taxesPer) || 0;
        const units = parseInt(form.numUnits) || 1;

        const withTax = bc + tx;
        const total = withTax * units;

        setForm(f => ({
            ...f,
            costWithTax: withTax > 0 ? withTax.toFixed(2) : '',
            totalAmount: total > 0 ? total.toFixed(2) : ''
        }));
    }, [form.basicCost, form.taxesPer, form.numUnits]);

    const exportPDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const margin = 10;
        const pageWidth = 210;
        const tableWidth = 190;

        let y = 12;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);

        doc.text('LUFTEN ELEVATOR', pageWidth / 2, y, {
            align: 'center'
        });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        doc.text('Lift Quotation & Specification', pageWidth / 2, y + 6, {
            align: 'center'
        });

        doc.line(margin, y + 10, pageWidth - margin, y + 10);

        y += 18;

        const rowHeight = 8;
        const labelW = 90;
        const valueW = 100;

        const checkPage = height => {
            if (y + height > 280) {
                doc.addPage();
                y = 15;
            }
        };

        const drawSection = title => {
            checkPage(15);

            doc.setFillColor(220, 220, 235);

            doc.rect(margin, y, tableWidth, rowHeight, 'FD');

            doc.setFont('times', 'bold');
            doc.setFontSize(10);

            doc.text(title, margin + 2, y + 5.5);

            y += rowHeight;
        };

        const drawRow = (label, value = '') => {
            const splitValue = doc.splitTextToSize(String(value || ''), valueW - 4);

            const splitLabel = doc.splitTextToSize(String(label || ''), labelW - 4);

            const lines = Math.max(splitValue.length, splitLabel.length);

            const dynamicHeight = Math.max(rowHeight, lines * 5 + 3);

            checkPage(dynamicHeight);

            doc.rect(margin, y, labelW, dynamicHeight);

            doc.rect(margin + labelW, y, valueW, dynamicHeight);

            doc.setFont('times', 'normal');

            doc.setFontSize(9);

            doc.text(splitLabel, margin + 2, y + 5);

            doc.text(splitValue, margin + labelW + 2, y + 5);

            y += dynamicHeight;
        };

        drawSection('Client Information');

        drawRow('Date', form.date);
        drawRow('Client Name', form.clientName);
        drawRow('Contact Name', form.contactName);
        drawRow('Mobile No', form.mobile);
        drawRow('Project Name', form.projectName);
        drawRow('Project Address', form.projectAddress);

        drawSection('A. Lift Configuration');

        drawRow('Group', form.group);
        drawRow('Lift Type', form.liftType);
        drawRow('Number Of Units', form.numUnits);
        drawRow('Door Operation', form.doorOperation);
        drawRow('Passengers', form.passengers);
        drawRow('Operations', form.operations);
        drawRow('Speed (m/s)', form.speed);
        drawRow('Floors', form.floors);
        drawRow('No Of Opening', form.noOfOpening);
        drawRow('Machine Room', form.machineRoom);

        drawSection('B. Civil Dimensions');

        drawRow('Door Width (mm)', form.doorWidth);
        drawRow('Door Height (mm)', form.doorHeight);
        drawRow('Shaft Width (mm)', form.shaftWidth);
        drawRow('Shaft Depth (mm)', form.shaftDepth);
        drawRow('Shaft Details', form.shaftDetails);

        drawSection('C. Car & Landing Details');

        drawRow('Car Door Type', form.carDoorType);
        drawRow('Car Door Finish', form.carDoorFinish);
        drawRow('Landing Door Type', form.landingDoorType);

        drawRow('Landing Door Finish', form.landingDoorFinish);

        drawRow('Door Frame Location', form.doorFrameLocation);

        drawRow('Car Panels', form.carPanels);

        drawRow('False Ceiling', form.falseCeiling);

        drawRow('Car Ventilation', form.carVentilation);

        drawRow('Flooring', form.flooring);

        drawRow('Handrail', form.handrail);

        drawRow('Handrail Location', form.handrailLocation);

        drawRow('LOP and COP', form.lopCop);

        drawRow('Display In COP', form.displayCop);

        drawSection('D. Features');

        drawRow('Auto Rescue Device', form.autoRescue ? 'YES' : 'NO');

        drawRow('Overload', form.overload ? 'YES' : 'NO');

        drawRow('On / Off Key', form.onOffKey ? 'YES' : 'NO');

        drawRow('Mobile Operated', form.mobileOperated ? 'YES' : 'NO');

        drawRow('RFID / Fingerprint', form.rfid ? 'YES' : 'NO');

        drawRow('Emergency 5 Call', form.emergency5call ? 'YES' : 'NO');

        drawRow('Site Readiness', form.siteReadiness ? 'YES' : 'NO');

        drawRow('Logo', form.logo ? 'YES' : 'NO');

        drawSection('E. Pricing Details');

        drawRow('Lift Description', form.liftDesc);

        drawRow('Basic Cost', form.basicCost);

        drawRow('Taxes', form.taxesPer);

        drawRow('Cost With Tax', form.costWithTax);

        drawRow('Total Amount', form.totalAmount);

        drawSection('Notes');

        drawRow('Additional Notes', form.note);

        doc.save(`${form.projectName || 'pdf'}.pdf`);
    };

    const fmt = n =>
        n
            ? '₹' +
              parseFloat(n).toLocaleString('en-IN', {
                  minimumFractionDigits: 2
              })
            : '—';

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Luften Elevator</h1>

                    <p className={styles.pageSubtitle}>Lift Quotation & Specification Form</p>
                </div>

                {/* <button className={styles.btnExport} onClick={exportPDF}>
                    <DownloadIcon />
                    Export PDF
                </button> */}
            </div>

            <Section title="Client Information">
                <div className={styles.grid}>
                    <Field label="Date" half>
                        <input type="date" value={form.date} onChange={set('date')} />
                    </Field>

                    <Field label="Client Name" half>
                        <input placeholder="Enter client name" value={form.clientName} onChange={set('clientName')} />
                    </Field>

                    <Field label="Contact Name" half>
                        <input placeholder="Enter contact name" value={form.contactName} onChange={set('contactName')} />
                    </Field>

                    <Field label="Mobile No" half>
                        <input type="tel" placeholder="Enter mobile number" value={form.mobile} onChange={set('mobile')} />
                    </Field>

                    <Field label="Project Name" half>
                        <input placeholder="Enter project name" value={form.projectName} onChange={set('projectName')} />
                    </Field>

                    <Field label="Project Address" half>
                        <input placeholder="Enter project address" value={form.projectAddress} onChange={set('projectAddress')} />
                    </Field>
                </div>
            </Section>

            <Section title="A. Lift Configuration">
                <div className={styles.grid}>
                    <Field label="Group" half>
                        <input placeholder="Enter group" value={form.group} onChange={set('group')} />
                    </Field>

                    <Field label="Lift Type" half>
                        <select value={form.liftType} onChange={set('liftType')}>
                            <option value="">Select Lift Type</option>

                            <option>Rope MRL</option>

                            <option>Belt MRL</option>

                            <option>Hydraulic</option>

                            <option>Traction (geared)</option>
                        </select>
                    </Field>

                    <Field label="Number of Units" half>
                        <input type="number" placeholder="Enter units" value={form.numUnits} onChange={set('numUnits')} />
                    </Field>

                    <Field label="Door Operation" half>
                        <select value={form.doorOperation} onChange={set('doorOperation')}>
                            <option value="">Select Door Operation</option>

                            <option>Automatic</option>

                            <option>Manual</option>
                        </select>
                    </Field>

                    <Field label="Passengers" half>
                        <input type="number" placeholder="Enter passengers" value={form.passengers} onChange={set('passengers')} />
                    </Field>

                    <Field label="Operations" half>
                        <select value={form.operations} onChange={set('operations')}>
                            <option value="">Select Operation</option>

                            <option>Fully Collective</option>

                            <option>Down Collective</option>
                        </select>
                    </Field>

                    <Field label="Speed (m/s)" half>
                        <input type="number" placeholder="Enter speed" value={form.speed} onChange={set('speed')} />
                    </Field>

                    <Field label="Floors" half>
                        <input placeholder="Enter floors" value={form.floors} onChange={set('floors')} />
                    </Field>

                    <Field label="No Of Opening" half>
                        <input type="number" placeholder="Enter openings" value={form.noOfOpening} onChange={set('noOfOpening')} />
                    </Field>

                    <Field label="Machine Room" half>
                        <input placeholder="Yes / No / Top" value={form.machineRoom} onChange={set('machineRoom')} />
                    </Field>
                </div>
            </Section>

            <Section title="B. Civil Dimensions">
                <div className={styles.grid}>
                    <Field label="Door Width (mm)" half>
                        <input type="number" placeholder="Enter door width" value={form.doorWidth} onChange={set('doorWidth')} />
                    </Field>

                    <Field label="Door Height (mm)" half>
                        <input type="number" placeholder="Enter door height" value={form.doorHeight} onChange={set('doorHeight')} />
                    </Field>

                    <Field label="Shaft Width (mm)" half>
                        <input placeholder="Enter shaft width" value={form.shaftWidth} onChange={set('shaftWidth')} />
                    </Field>

                    <Field label="Shaft Depth (mm)" half>
                        <input placeholder="Enter shaft depth" value={form.shaftDepth} onChange={set('shaftDepth')} />
                    </Field>

                    <Field label="Shaft Details">
                        <select value={form.shaftDetails} onChange={set('shaftDetails')}>
                            <option value="">Select Shaft Details</option>

                            <option>RCC</option>
                            <option>M.S Structure</option>
                            <option>9-inch Brick Wall</option>

                            <option>RCC / M.S Structure</option>

                            <option>RCC / M.S Structure / 9-inch Brick Wall</option>
                        </select>
                    </Field>
                </div>
            </Section>

            <Section title="C. Car & Landing Details">
                <div className={styles.grid}>
                    <Field label="Car Door Type" half>
                        <input placeholder="Enter car door type" value={form.carDoorType} onChange={set('carDoorType')} />
                    </Field>

                    <Field label="Car Door Finish" half>
                        <input placeholder="Enter car door finish" value={form.carDoorFinish} onChange={set('carDoorFinish')} />
                    </Field>

                    <Field label="Landing Door Type" half>
                        <input placeholder="Enter landing door type" value={form.landingDoorType} onChange={set('landingDoorType')} />
                    </Field>

                    <Field label="Landing Door Finish" half>
                        <input placeholder="Enter landing door finish" value={form.landingDoorFinish} onChange={set('landingDoorFinish')} />
                    </Field>

                    <Field label="Door Frame Location" half>
                        <input placeholder="Enter frame location" value={form.doorFrameLocation} onChange={set('doorFrameLocation')} />
                    </Field>

                    <Field label="Car Panels" half>
                        <input placeholder="Enter car panels" value={form.carPanels} onChange={set('carPanels')} />
                    </Field>

                    <Field label="False Ceiling" half>
                        <input placeholder="Enter false ceiling" value={form.falseCeiling} onChange={set('falseCeiling')} />
                    </Field>

                    <Field label="Car Ventilation" half>
                        <input placeholder="Enter ventilation" value={form.carVentilation} onChange={set('carVentilation')} />
                    </Field>

                    <Field label="Flooring" half>
                        <input placeholder="Enter flooring" value={form.flooring} onChange={set('flooring')} />
                    </Field>

                    <Field label="Handrail" half>
                        <input placeholder="Enter handrail" value={form.handrail} onChange={set('handrail')} />
                    </Field>

                    <Field label="Handrail Location" half>
                        <input placeholder="Enter handrail location" value={form.handrailLocation} onChange={set('handrailLocation')} />
                    </Field>

                    <Field label="LOP and COP" half>
                        <input placeholder="Enter LOP and COP" value={form.lopCop} onChange={set('lopCop')} />
                    </Field>

                    <Field label="Display In COP" half>
                        <input placeholder="Enter display type" value={form.displayCop} onChange={set('displayCop')} />
                    </Field>
                </div>
            </Section>

            <Section title="Notes">
                <Field label="Additional Notes">
                    <textarea rows={5} placeholder="Enter notes here..." value={form.note} onChange={set('note')} />
                </Field>
            </Section>

            <div className={styles.footerBtns}>
                <button
                    className={styles.btnReset}
                    onClick={() =>
                        setForm({
                            ...INIT
                        })
                    }
                >
                    Reset Form
                </button>

                <button className={styles.btnExport} onClick={exportPDF}>
                    <DownloadIcon />
                    Download PDF
                </button>
            </div>
        </div>
    );
}

function DownloadIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
    );
}
