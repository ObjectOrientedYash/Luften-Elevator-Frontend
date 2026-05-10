import {useState, useEffect} from 'react';
import {jsPDF} from 'jspdf';
import styles from './LiftForm.module.css';

/* ─── reusable layout pieces ─── */
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

/* ─── initial form state ─── */
const INIT = {
    date: '09/04/2026',
    clientName: 'NEELKANTH',
    contactName: 'DHARMENDRABHAI',
    mobile: '9825013888',
    projectName: 'NEELKANTH',
    projectAddress: 'SEC. 24 Gandhinagar',
    group: '001',
    liftType: 'Rope MRL',
    numUnits: '01',
    doorOperation: 'Automatic',
    passengers: '06',
    operations: 'Fully Collective',
    speed: '1.00',
    floors: 'G + 4',
    noOfOpening: '05',
    machineRoom: '',
    doorWidth: '',
    doorHeight: '',
    shaftWidth: '2000 X 1900',
    shaftDepth: '',
    shaftDetails: 'RCC / M.S Structure / 9-inch Brick Wall',
    carDoorType: 'AIUTO CO',
    carDoorFinish: 'SS',
    landingDoorType: 'SS SMALL VISION',
    landingDoorFinish: '',
    doorFrameLocation: '',
    carPanels: 'SS HAIRLINE',
    falseCeiling: '',
    carVentilation: '',
    flooring: 'PVC',
    handrail: '',
    handrailLocation: '',
    lopCop: 'PUSH BUTTON',
    displayCop: '',
    autoRescue: true,
    overload: true,
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
    totalAmount: ''
};

export default function LiftForm() {
    const [form, setForm] = useState(INIT);

    /* helper setters */
    const set = key => e => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm(f => ({...f, [key]: val}));
    };

    /* auto-calculate cost columns */
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.basicCost, form.taxesPer, form.numUnits]);

    /* ─── PDF export ─── */
    const exportPDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const margin = 10;
        const pageWidth = 210;
        const tableWidth = 190;

        let y = 10;

        const rowHeight = 8;
        const labelW = 90;
        const valueW = 100;

        const drawSection = title => {
            doc.setFillColor(220, 220, 235);
            doc.setDrawColor(170, 170, 170);

            doc.rect(margin, y, tableWidth, rowHeight, 'FD');

            doc.setFont('times', 'bold');
            doc.setFontSize(10);

            doc.text(title, margin + 2, y + 5.5);

            y += rowHeight;
        };

        const drawRow = (label, value = '') => {
            if (y > 260) {
                doc.addPage();
                y = 10;
            }

            const splitValue = doc.splitTextToSize(String(value || ''), valueW - 4);

            const splitLabel = doc.splitTextToSize(String(label || ''), labelW - 4);

            const lines = Math.max(splitValue.length, splitLabel.length);

            const dynamicHeight = Math.max(rowHeight, lines * 5 + 3);

            doc.setDrawColor(180, 180, 180);

            doc.rect(margin, y, labelW, dynamicHeight);
            doc.rect(margin + labelW, y, valueW, dynamicHeight);

            doc.setFont('times', 'normal');
            doc.setFontSize(9);

            doc.text(splitLabel, margin + 2, y + 5);

            doc.text(splitValue, margin + labelW + 2, y + 5);

            y += dynamicHeight;
        };

        /* PAGE 1 */

        drawRow('Date', form.date);
        drawRow('Client name', form.clientName);
        drawRow('Contact name', form.contactName);
        drawRow('Mobile no', form.mobile);
        drawRow('Project Name', form.projectName);
        drawRow('Project Address', form.projectAddress);

        y += 4;

        drawRow('Group', form.group);

        drawRow(
            'Lift Type',
            `1) Rope MRL
2) Belt MRL
3) Hydraulic
4) Traction (geared)

Selected : ${form.liftType}`
        );

        drawRow('Number Of Units', form.numUnits);

        drawRow(
            'Door Operation',
            `1) Automatic
2) Manual

Selected : ${form.doorOperation}`
        );

        drawRow('Number of Passengers (KG)', `${form.passengers} PASSENGERS`);

        drawRow(
            'Operations',
            `1) Fully collective
2) Down Collective

Selected : ${form.operations}`
        );

        drawRow('Speed (m/s)', form.speed);
        drawRow('Floors', form.floors);
        drawRow('No Of Opening', form.noOfOpening);
        drawRow('Machine Room', form.machineRoom);

        drawSection('B. Civil Dimensions');

        drawRow('Door Width (mm)', form.doorWidth);
        drawRow('Door Height (mm)', form.doorHeight);
        drawRow('Shaft Width (mm)', form.shaftWidth);
        drawRow('Shaft Depth (mm)', form.shaftDepth);
        drawRow('Shaft details (mm)', form.shaftDetails);

        /* PAGE 2 */

        doc.addPage();
        y = 15;

        drawSection('C. Car & Landing Details');

        drawRow('Car Door Type', form.carDoorType);
        drawRow('Car Door Finish', form.carDoorFinish);
        drawRow('Landing Door Type', form.landingDoorType);

        drawRow('Landing Door Finish With Locations', form.landingDoorFinish);

        drawRow('Door Frame Location', form.doorFrameLocation);

        drawRow('Car Panels - Shade / Finish', form.carPanels);

        drawRow('False Ceiling', form.falseCeiling);
        drawRow('Car Ventilation', form.carVentilation);
        drawRow('Flooring', form.flooring);
        drawRow('Handrail', form.handrail);
        drawRow('Handrail Location', form.handrailLocation);
        drawRow('LOP and COP', form.lopCop);
        drawRow('Display In COP', form.displayCop);

        drawSection('D. Standard Control Functions / Features');

        drawRow('Auto Rescue Device In Case Of Power Failure', form.autoRescue ? 'YES' : '');

        drawRow('Overload', form.overload ? 'YES' : '');

        drawRow('On/Off Key', form.onOffKey ? 'YES' : '');

        drawRow('Mobile operated', form.mobileOperated ? 'YES' : '');

        drawRow('RFID/Finger print/ Password system', form.rfid ? 'YES' : '');

        drawRow('Emergency 5 call system', form.emergency5call ? 'YES' : '');

        drawRow('Site readiness', form.siteReadiness ? 'YES' : '');

        drawRow('LOGO', form.logo ? 'YES' : '');

        y += 12;

        /* PRICING TABLE */

        const cols = [15, 28, 22, 35, 28, 28, 34];

        const headers = [
            'Sr.No.',
            'Lift Description',
            'No.\nOf\nUnits',
            'Basic Cost Per\nUnit',
            'Taxes Per\nUnit',
            'Cost Per Unit\nWith Tax',
            'Total Amount\nINR'
        ];

        let x = margin;

        doc.setFont('times', 'bold');
        doc.setFontSize(8);

        headers.forEach((header, i) => {
            doc.rect(x, y, cols[i], 18);

            doc.text(header, x + cols[i] / 2, y + 7, {
                align: 'center',
                maxWidth: cols[i] - 2
            });

            x += cols[i];
        });

        y += 18;

        const basic = parseFloat(form.basicCost) || 0;
        const taxes = parseFloat(form.taxesPer) || 0;
        const units = parseInt(form.numUnits) || 0;

        const withTax = basic + taxes;
        const total = withTax * units;

        const rowData = [
            '1',
            form.liftDesc,
            form.numUnits,
            basic ? basic.toFixed(2) : '',
            taxes ? taxes.toFixed(2) : '',
            withTax ? withTax.toFixed(2) : '',
            total ? total.toFixed(2) : ''
        ];

        x = margin;

        doc.setFont('times', 'normal');
        doc.setFontSize(8);

        rowData.forEach((item, i) => {
            doc.rect(x, y, cols[i], 18);

            doc.text(String(item || ''), x + cols[i] / 2, y + 9, {
                align: 'center',
                maxWidth: cols[i] - 2
            });

            x += cols[i];
        });

        doc.save('Luften_Lift_Quotation.pdf');
    };

    /* ─── render ─── */
    const fmt = n => (n ? '₹' + parseFloat(n).toLocaleString('en-IN', {minimumFractionDigits: 2}) : '—');

    return (
        <div className={styles.wrapper}>
            {/* header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Luften Elevator</h1>
                    <p className={styles.pageSubtitle}>Lift Quotation &amp; Specification Form</p>
                </div>
                <button className={styles.btnExport} onClick={exportPDF}>
                    <DownloadIcon /> Export PDF
                </button>
            </div>

            {/* ── Client Info ── */}
            <Section title="Client Information">
                <div className={styles.grid}>
                    <Field label="Date" half>
                        <input value={form.date} onChange={set('date')} />
                    </Field>
                    <Field label="Client Name" half>
                        <input value={form.clientName} onChange={set('clientName')} />
                    </Field>
                    <Field label="Contact Name" half>
                        <input value={form.contactName} onChange={set('contactName')} />
                    </Field>
                    <Field label="Mobile No" half>
                        <input value={form.mobile} onChange={set('mobile')} />
                    </Field>
                    <Field label="Project Name" half>
                        <input value={form.projectName} onChange={set('projectName')} />
                    </Field>
                    <Field label="Project Address" half>
                        <input value={form.projectAddress} onChange={set('projectAddress')} />
                    </Field>
                </div>
            </Section>

            {/* ── A. Config ── */}
            <Section title="A. Lift Configuration">
                <div className={styles.grid}>
                    <Field label="Group" half>
                        <input value={form.group} onChange={set('group')} />
                    </Field>
                    <Field label="Lift Type" half>
                        <select value={form.liftType} onChange={set('liftType')}>
                            <option>Rope MRL</option>
                            <option>Belt MRL</option>
                            <option>Hydraulic</option>
                            <option>Traction (geared)</option>
                        </select>
                    </Field>
                    <Field label="Number of Units" half>
                        <input value={form.numUnits} onChange={set('numUnits')} />
                    </Field>
                    <Field label="Door Operation" half>
                        <select value={form.doorOperation} onChange={set('doorOperation')}>
                            <option>Automatic</option>
                            <option>Manual</option>
                        </select>
                    </Field>
                    <Field label="Number of Passengers" half>
                        <input value={form.passengers} onChange={set('passengers')} />
                    </Field>
                    <Field label="Operations" half>
                        <select value={form.operations} onChange={set('operations')}>
                            <option>Fully Collective</option>
                            <option>Down Collective</option>
                        </select>
                    </Field>
                    <Field label="Speed (m/s)" half>
                        <input value={form.speed} onChange={set('speed')} />
                    </Field>
                    <Field label="Floors" half>
                        <input value={form.floors} onChange={set('floors')} />
                    </Field>
                    <Field label="No Of Opening" half>
                        <input value={form.noOfOpening} onChange={set('noOfOpening')} />
                    </Field>
                    <Field label="Machine Room" half>
                        <input value={form.machineRoom} onChange={set('machineRoom')} placeholder="Yes / No / Top" />
                    </Field>
                </div>
            </Section>

            {/* ── B. Civil ── */}
            <Section title="B. Civil Dimensions">
                <div className={styles.grid}>
                    <Field label="Door Width (mm)" half>
                        <input value={form.doorWidth} onChange={set('doorWidth')} />
                    </Field>
                    <Field label="Door Height (mm)" half>
                        <input value={form.doorHeight} onChange={set('doorHeight')} />
                    </Field>
                    <Field label="Shaft Width (mm)" half>
                        <input value={form.shaftWidth} onChange={set('shaftWidth')} />
                    </Field>
                    <Field label="Shaft Depth (mm)" half>
                        <input value={form.shaftDepth} onChange={set('shaftDepth')} />
                    </Field>
                    <Field label="Shaft Details">
                        <select value={form.shaftDetails} onChange={set('shaftDetails')}>
                            <option>RCC</option>
                            <option>M.S Structure</option>
                            <option>9-inch Brick Wall</option>
                            <option>RCC / M.S Structure</option>
                            <option>RCC / M.S Structure / 9-inch Brick Wall</option>
                        </select>
                    </Field>
                </div>
            </Section>

            {/* ── C. Car & Landing ── */}
            <Section title="C. Car & Landing Details">
                <div className={styles.grid}>
                    <Field label="Car Door Type" half>
                        <input value={form.carDoorType} onChange={set('carDoorType')} />
                    </Field>
                    <Field label="Car Door Finish" half>
                        <input value={form.carDoorFinish} onChange={set('carDoorFinish')} />
                    </Field>
                    <Field label="Landing Door Type" half>
                        <input value={form.landingDoorType} onChange={set('landingDoorType')} />
                    </Field>
                    <Field label="Landing Door Finish With Locations" half>
                        <input value={form.landingDoorFinish} onChange={set('landingDoorFinish')} />
                    </Field>
                    <Field label="Door Frame Location" half>
                        <input value={form.doorFrameLocation} onChange={set('doorFrameLocation')} />
                    </Field>
                    <Field label="Car Panels - Shade / Finish" half>
                        <input value={form.carPanels} onChange={set('carPanels')} />
                    </Field>
                    <Field label="False Ceiling" half>
                        <input value={form.falseCeiling} onChange={set('falseCeiling')} />
                    </Field>
                    <Field label="Car Ventilation" half>
                        <input value={form.carVentilation} onChange={set('carVentilation')} />
                    </Field>
                    <Field label="Flooring" half>
                        <input value={form.flooring} onChange={set('flooring')} />
                    </Field>
                    <Field label="Handrail" half>
                        <input value={form.handrail} onChange={set('handrail')} />
                    </Field>
                    <Field label="Handrail Location" half>
                        <input value={form.handrailLocation} onChange={set('handrailLocation')} />
                    </Field>
                    <Field label="LOP and COP" half>
                        <input value={form.lopCop} onChange={set('lopCop')} />
                    </Field>
                    <Field label="Display In COP" half>
                        <input value={form.displayCop} onChange={set('displayCop')} />
                    </Field>
                </div>
            </Section>

            {/* ── D. Features ── */}
            <Section title="D. Standard Control Functions / Features">
                <div className={styles.checkGrid}>
                    <CheckItem label="Auto Rescue Device (Power Failure)" checked={form.autoRescue} onChange={set('autoRescue')} />
                    <CheckItem label="Overload Protection" checked={form.overload} onChange={set('overload')} />
                    <CheckItem label="On/Off Key" checked={form.onOffKey} onChange={set('onOffKey')} />
                    <CheckItem label="Mobile Operated" checked={form.mobileOperated} onChange={set('mobileOperated')} />
                    <CheckItem label="RFID / Fingerprint / Password System" checked={form.rfid} onChange={set('rfid')} />
                    <CheckItem label="Emergency 5 Call System" checked={form.emergency5call} onChange={set('emergency5call')} />
                    <CheckItem label="Site Readiness" checked={form.siteReadiness} onChange={set('siteReadiness')} />
                    <CheckItem label="LOGO" checked={form.logo} onChange={set('logo')} />
                </div>
            </Section>

            {/* ── Pricing ── */}
            <Section title="Pricing Details">
                <div className={styles.tableWrap}>
                    <table className={styles.pricingTable}>
                        <thead>
                            <tr>
                                {[
                                    'Sr.No',
                                    'Lift Description',
                                    'No. of Units',
                                    'Basic Cost / Unit (₹)',
                                    'Taxes / Unit (₹)',
                                    'Cost With Tax / Unit (₹)',
                                    'Total Amount (₹)'
                                ].map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.srNo}>1</td>
                                <td>
                                    <input
                                        value={form.liftDesc}
                                        onChange={set('liftDesc')}
                                        placeholder="e.g. Rope MRL 6P G+4"
                                        style={{minWidth: 160}}
                                    />
                                </td>
                                <td>
                                    <input value={form.numUnits} onChange={set('numUnits')} style={{width: 60}} />
                                </td>
                                <td>
                                    <input type="number" value={form.basicCost} onChange={set('basicCost')} placeholder="0.00" style={{width: 110}} />
                                </td>
                                <td>
                                    <input type="number" value={form.taxesPer} onChange={set('taxesPer')} placeholder="0.00" style={{width: 90}} />
                                </td>
                                <td className={styles.autoCell}>{fmt(form.costWithTax)}</td>
                                <td className={styles.totalCell}>{fmt(form.totalAmount)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className={styles.note}>* Cost With Tax and Total Amount are auto-calculated (Basic Cost + Taxes) × Units.</p>
            </Section>

            {/* footer buttons */}
            <div className={styles.footerBtns}>
                <button className={styles.btnReset} onClick={() => setForm(INIT)}>
                    Reset Form
                </button>
                <button className={styles.btnExport} onClick={exportPDF}>
                    <DownloadIcon /> Download PDF Quotation
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
