import { createStateLink, useStateLink } from '@hookstate/core';

const state = createStateLink({ isEditableInline: false })

export function useSettingsState() {
    return useStateLink(state, s => ({
        get isEditableInline() {
            return s.nested.isEditableInline.get()
        },
        toogleEditableInline() {
            s.nested.isEditableInline.set(p => !p)
        }
    }))
}
