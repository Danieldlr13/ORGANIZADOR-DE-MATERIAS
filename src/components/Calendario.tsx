import React, { useMemo, useState, useEffect } from "react";
import { useFirestoreEventos } from "../hooks/useFirestoreEventos";
import type { Evento } from "../hooks/useFirestoreEventos";

// Zona horaria de Colombia
const TIMEZONE = 'America/Bogota';

// Obtener fecha actual en zona horaria de Colombia
function getNowInColombia() {
	const now = new Date();
	const colombiaTime = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }));
	return colombiaTime;
}

function startOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, n: number) {
	return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function formatMonthYear(date: Date) {
	return date.toLocaleString('es-CO', { month: "long", year: "numeric", timeZone: TIMEZONE });
}

function dateToISODate(date: Date) {
	// Convertir a zona horaria de Colombia antes de obtener ISO
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export default function Calendario() {
	const { eventos, loading, error, syncing, createEvento, updateEvento, deleteEvento } = useFirestoreEventos();
	const [cursor, setCursor] = useState<Date>(() => startOfMonth(getNowInColombia()));
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [editing, setEditing] = useState<Evento | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
		const monthGrid = useMemo(() => {
		const start = startOfMonth(cursor);
		const end = endOfMonth(cursor);
		const startWeekDay = start.getDay(); // 0 (Sun) - 6 (Sat)
		const daysInMonth = end.getDate();

		// We'll build a 6x7 grid (weeks x days)
		const cells: { date: Date | null }[] = [];
		// fill leading blanks
		for (let i = 0; i < startWeekDay; i++) cells.push({ date: null });
		for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), d) });
		// trailing blanks to complete weeks
		while (cells.length % 7 !== 0) cells.push({ date: null });
		// ensure 6 rows
		while (cells.length < 42) cells.push({ date: null });

		const weeks: (Date | null)[][] = [];
		for (let i = 0; i < cells.length; i += 7) {
			weeks.push(cells.slice(i, i + 7).map((c) => c.date));
		}
		return weeks;
	}, [cursor]);

	function eventosParaDia(isoDate: string) {
		return eventos.filter((e) => e.start === isoDate);
	}

	function openNewModalFor(date: Date) {
		setSelectedDate(dateToISODate(date));
		setEditing(null);
		setIsModalOpen(true);
	}

	function openEditModal(evt: Evento) {
		setEditing(evt);
		setSelectedDate(evt.start);
		setIsModalOpen(true);
	}

	async function handleSave(form: { title: string; description?: string; start: string; color?: string }) {
		try {
			if (editing) {
				await updateEvento(editing.id, form);
			} else {
				await createEvento(form);
			}
			setIsModalOpen(false);
			setEditing(null);
		} catch (err) {
			console.error('Error al guardar evento:', err);
			alert('Error al guardar el evento. Intenta nuevamente.');
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("¿Eliminar este evento?")) return;
		try {
			await deleteEvento(id);
			setIsModalOpen(false);
			setEditing(null);
		} catch (err) {
			console.error('Error al eliminar evento:', err);
			alert('Error al eliminar el evento. Intenta nuevamente.');
		}
	}

	if (loading) {
		return (
			<div className="calendario-container">
				<div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
					<div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
					<p>Cargando calendario...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="calendario-container">
				<div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
					<div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
					<p>{error}</p>
					<p style={{ fontSize: '0.875rem', color: '#666', marginTop: '1rem' }}>
						Verifica tu configuración de Firebase
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="calendario-container">
			<div className="calendario-header">
				<nav className="calendario-nav">
					<button onClick={() => setCursor(addMonths(cursor, -1))}>{"<"}</button>
					<button onClick={() => setCursor(startOfMonth(getNowInColombia()))}>Hoy</button>
					<button onClick={() => setCursor(addMonths(cursor, 1))}>{">"}</button>
				</nav>
				<h3 className="calendario-month-title">{formatMonthYear(cursor)}</h3>
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '0.875rem' }}>
					{syncing && (
						<>
							<div className="sync-indicator spinning">⟳</div>
							<span>Sincronizando...</span>
						</>
					)}
					{!syncing && (
						<>
							<div className="sync-indicator">✓</div>
							<span>Sincronizado</span>
						</>
					)}
				</div>
			</div>

			<div className="calendario-weekdays">
				{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
					<div key={d}>{d}</div>
				))}
			</div>

			<div className="calendario-grid">
				{monthGrid.map((week, wi) => (
					<React.Fragment key={wi}>
						{week.map((day, di) => {
							if (!day) return <div key={di} className="calendario-day-empty" />;
							const iso = dateToISODate(day);
							const evts = eventosParaDia(iso);
							const isToday = iso === dateToISODate(getNowInColombia());
							return (
								<div key={di} className="calendario-day">
									<div className="calendario-day-header">
										<div className="calendario-day-number">{day.getDate()}</div>
										<button className="calendario-add-btn" onClick={() => openNewModalFor(day)} title="Añadir evento">
											+
										</button>
									</div>
									<div className="calendario-events">
										{evts.slice(0, 3).map((ev) => (
											<div
												key={ev.id}
												className="calendario-event"
												onClick={() => openEditModal(ev)}
												style={{ background: ev.color || '#dbeafe' }}
												title={ev.title}
											>
												{ev.title}
											</div>
										))}
										{evts.length > 3 && <div className="calendario-more-events">+{evts.length - 3} más</div>}
									</div>
									{isToday && <div className="calendario-today-indicator" />}
								</div>
							);
						})}
					</React.Fragment>
				))}
			</div>

			{isModalOpen && (
				<Modal onClose={() => { setIsModalOpen(false); setEditing(null); }}>
					<EventForm
						key={editing ? editing.id : 'new'}
						initial={editing ?? { id: '', title: '', description: '', start: selectedDate ?? dateToISODate(getNowInColombia()), color: '#1b95d2' }}
						onCancel={() => { setIsModalOpen(false); setEditing(null); }}
						onSave={(data) => handleSave(data)}
						onDelete={(id) => handleDelete(id)}
					/>
				</Modal>
			)}
		</div>
	);
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose();
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onClose]);

	return (
		<div className="modal-overlay" onMouseDown={onClose}>
			<div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
}

function EventForm({ initial, onSave, onCancel, onDelete }: { initial: Evento; onSave: (data: { title: string; description?: string; start: string; color?: string }) => void; onCancel: () => void; onDelete: (id: string) => void }) {
	const [title, setTitle] = useState(initial.title || '');
	const [description, setDescription] = useState(initial.description || '');
	const [start, setStart] = useState(initial.start || dateToISODate(getNowInColombia()));
	const [color, setColor] = useState(initial.color || '#1b95d2');

	return (
		<div>
			<h3 className="modal-title">{initial.id ? 'Editar evento' : 'Nuevo evento'}</h3>
			<div>
				<div className="form-group">
					<label>Título</label>
					<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre del evento" />
				</div>
				<div className="form-group">
					<label>Fecha</label>
					<input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
				</div>
				<div className="form-group">
					<label>Color</label>
					<input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
				</div>
				<div className="form-group">
					<label>Descripción</label>
					<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalles opcionales..." />
				</div>

				<div className="form-actions">
					{initial.id && (
						<button className="btn-delete" onClick={() => onDelete(initial.id)}>
							Eliminar
						</button>
					)}
					<button className="btn-cancel" onClick={onCancel}>Cancelar</button>
					<button
						className="btn-save"
						onClick={() => {
							if (!title.trim()) return alert('El título es obligatorio');
							onSave({ title: title.trim(), description: description.trim(), start, color });
						}}
					>
						Guardar
					</button>
				</div>
			</div>
		</div>
	);
}

// persist events whenever they change
// (this is intentionally outside component to keep behavior explicit in useEffect above)