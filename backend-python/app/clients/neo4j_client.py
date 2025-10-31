"""
Neo4j client for medical ontology queries.
Connects to Neo4j Aura graph database for symptoms, medications, and relationships.
"""
import os
from typing import List, Dict, Optional
from neo4j import AsyncGraphDatabase, AsyncDriver


class Neo4jClient:
    def __init__(self):
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USER", "neo4j")
        password = os.getenv("NEO4J_PASSWORD")
        
        if not all([uri, password]):
            raise ValueError("NEO4J_URI and NEO4J_PASSWORD must be set in environment")
        
        self.driver: AsyncDriver = AsyncGraphDatabase.driver(uri, auth=(user, password))
    
    async def close(self):
        await self.driver.close()
    
    async def search_symptoms(self, query: str) -> List[Dict]:
        """
        Search for symptoms matching the query text.
        Example: query="fever" -> returns nodes with label Symptom containing "fever"
        """
        async with self.driver.session() as session:
            result = await session.run(
                """
                MATCH (s:Symptom)
                WHERE toLower(s.name) CONTAINS toLower($query)
                RETURN s.name AS name, s.description AS description
                LIMIT 10
                """,
                query=query
            )
            records = [record.data() async for record in result]
            return records
    
    async def search_medications(self, query: str) -> List[Dict]:
        """
        Search for medications matching the query text.
        """
        async with self.driver.session() as session:
            result = await session.run(
                """
                MATCH (m:Medication)
                WHERE toLower(m.name) CONTAINS toLower($query)
                RETURN m.name AS name, m.type AS type, m.description AS description
                LIMIT 10
                """,
                query=query
            )
            records = [record.data() async for record in result]
            return records
    
    async def get_related_symptoms(self, symptom_name: str) -> List[str]:
        """
        Find symptoms often co-occurring with the given symptom.
        Useful for suggesting additional symptoms to log.
        """
        async with self.driver.session() as session:
            result = await session.run(
                """
                MATCH (s1:Symptom {name: $name})-[:RELATED_TO]-(s2:Symptom)
                RETURN s2.name AS related_symptom
                LIMIT 5
                """,
                name=symptom_name
            )
            records = [record["related_symptom"] async for record in result]
            return records


# Global instance (initialize once at startup)
neo4j_client: Optional[Neo4jClient] = None


async def get_neo4j_client() -> Neo4jClient:
    """
    Dependency injection for FastAPI routes.
    """
    global neo4j_client
    if neo4j_client is None:
        neo4j_client = Neo4jClient()
    return neo4j_client


async def close_neo4j_client():
    """
    Call on app shutdown to close driver.
    """
    global neo4j_client
    if neo4j_client:
        await neo4j_client.close()
        neo4j_client = None
