"use client"

import type { ReactNode } from "react"

interface ScenarioTab {
  id: string
  nome: string
}

interface ScenarioTabsProps {
  tabs: ScenarioTab[]
  ativo: string
  onSelect: (id: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
  children: (tab: ScenarioTab) => ReactNode
}

export function ScenarioTabs({ tabs, ativo, onSelect, onAdd, onRemove, children }: ScenarioTabsProps) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-4 overflow-x-auto" style={{ borderBottom: '2px solid #E3DCD0' }}>
        {tabs.map((tab) => (
          <div key={tab.id} className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onSelect(tab.id)}
              className={`px-3 py-2 text-sm font-medium rounded-t-md transition-colors ${
                tab.id === ativo
                  ? "bg-white border-x border-t"
                  : "text-[#9A9083] hover:text-[#2E2A24]"
              }`}
              style={{
                borderColor: tab.id === ativo ? '#E3DCD0' : 'transparent',
                color: tab.id === ativo ? '#A67C4E' : undefined,
                borderBottom: tab.id === ativo ? '2px solid white' : undefined,
                marginBottom: '-2px',
              }}
            >
              {tab.nome}
            </button>
            {tabs.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(tab.id)}
                className="p-1 text-[#9A9083] hover:text-[#C17A5A] text-xs"
                aria-label={`Remover ${tab.nome}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-2 text-sm text-[#9A9083] hover:text-[#A67C4E] shrink-0"
          aria-label="Adicionar cenário"
        >
          + Novo
        </button>
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} style={{ display: tab.id === ativo ? 'block' : 'none' }}>
          {children(tab)}
        </div>
      ))}
    </div>
  )
}
