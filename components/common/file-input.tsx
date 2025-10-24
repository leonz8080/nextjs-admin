"use client"

export function FileInput({ onFileSelect }: { onFileSelect: (file: File) => void }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) onFileSelect(file)
        e.target.value = ""
    }

    return <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
}