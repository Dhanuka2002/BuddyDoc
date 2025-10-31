from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from uuid import uuid4
import json
import os

from common.auth import get_current_user_or_secret

router = APIRouter()

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'journeys.json')


class JourneyEvent(BaseModel):
    id: Optional[str] = None
    title: str
    date: str
    location: Optional[str] = None
    note: Optional[str] = None


class JourneyStore:
    def __init__(self):
        self._data: Dict[str, List[Dict[str, Any]]] = {}
        self._load()

    def _load(self):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                self._data = json.load(f)
        except Exception:
            self._data = {}

    def _save(self):
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(self._data, f, indent=2)

    def list(self, user_id: str) -> List[Dict[str, Any]]:
        return self._data.get(user_id, [])

    def add(self, user_id: str, event: Dict[str, Any]) -> Dict[str, Any]:
        event_id = event.get('id') or str(uuid4())
        event['id'] = event_id
        self._data.setdefault(user_id, []).append(event)
        self._save()
        return event

    def update(self, user_id: str, event_id: str, patch: Dict[str, Any]) -> Dict[str, Any]:
        arr = self._data.get(user_id, [])
        for ev in arr:
            if ev.get('id') == event_id:
                ev.update(patch)
                self._save()
                return ev
        raise KeyError('not found')

    def delete(self, user_id: str, event_id: str) -> bool:
        arr = self._data.get(user_id, [])
        for i, ev in enumerate(arr):
            if ev.get('id') == event_id:
                arr.pop(i)
                self._save()
                return True
        return False


store = JourneyStore()


@router.get("/{user_id}", response_model=List[JourneyEvent])
def get_journey(user_id: str, user=Depends(get_current_user_or_secret)):
    return store.list(user_id)


@router.post("/{user_id}/events", response_model=JourneyEvent)
def create_event(user_id: str, ev: JourneyEvent, user=Depends(get_current_user_or_secret)):
    data = ev.dict()
    saved = store.add(user_id, data)
    return saved


@router.patch("/{user_id}/events/{event_id}", response_model=JourneyEvent)
def patch_event(user_id: str, event_id: str, patch: Dict[str, Any], user=Depends(get_current_user_or_secret)):
    try:
        updated = store.update(user_id, event_id, patch)
        return updated
    except KeyError:
        raise HTTPException(status_code=404, detail="event not found")


@router.delete("/{user_id}/events/{event_id}")
def delete_event(user_id: str, event_id: str, user=Depends(get_current_user_or_secret)):
    ok = store.delete(user_id, event_id)
    if not ok:
        raise HTTPException(status_code=404, detail="event not found")
    return {"ok": True}
