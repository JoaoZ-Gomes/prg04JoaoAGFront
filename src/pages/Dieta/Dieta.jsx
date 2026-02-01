import React, { useState, useEffect } from 'react'
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import * as clienteService from '../../services/clienteService'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './Dieta.css'

export default function Dieta() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [clienteInfo, setClienteInfo] = useState({})
  const [selectedMeal, setSelectedMeal] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const cliente = await clienteService.buscarMeuPerfil()
        setClienteInfo(cliente)
        setLoading(false)
      } catch (err) {
        console.error('Erro ao carregar informações:', err)
        setError('Erro ao carregar dados')
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Dados simulados temporários até integração completa com backend
  const currentDietPlan = {
    clientName: clienteInfo.nome || "Cliente",
    planName: "Dieta Personalizada",
    startDate: new Date().toLocaleDateString('pt-BR'),
    endDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('pt-BR'),
    meals: [
      {
        name: 'Café da Manhã',
        time: '07:00',
        foods: [
          { id: 1, name: 'Aveia (50g)', quantity: '50g', calories: 150, protein: 5, carbs: 27, fat: 3 },
          { id: 2, name: 'Banana', quantity: '1 unidade', calories: 105, protein: 1, carbs: 27, fat: 0 },
          { id: 3, name: 'Ovos (2)', quantity: '2 unidades', calories: 140, protein: 12, carbs: 1, fat: 10 },
        ]
      },
      {
        name: 'Lanche da Manhã',
        time: '10:00',
        foods: [
          { id: 4, name: 'Iogurte Grego', quantity: '150g', calories: 100, protein: 15, carbs: 6, fat: 0 },
          { id: 5, name: 'Amêndoas', quantity: '20g', calories: 120, protein: 4, carbs: 4, fat: 10 },
        ]
      },
      {
        name: 'Almoço',
        time: '13:00',
        foods: [
          { id: 6, name: 'Frango Grelhado', quantity: '150g', calories: 200, protein: 40, carbs: 0, fat: 5 },
          { id: 7, name: 'Arroz Integral', quantity: '100g', calories: 110, protein: 3, carbs: 23, fat: 1 },
          { id: 8, name: 'Brócolis', quantity: '100g', calories: 30, protein: 3, carbs: 6, fat: 0 },
        ]
      },
      {
        name: 'Lanche da Tarde',
        time: '16:00',
        foods: [
          { id: 9, name: 'Whey Protein', quantity: '1 scoop', calories: 120, protein: 25, carbs: 2, fat: 1 },
          { id: 10, name: 'Maçã', quantity: '1 unidade', calories: 80, protein: 0, carbs: 22, fat: 0 },
        ]
      },
      {
        name: 'Jantar',
        time: '19:00',
        foods: [
          { id: 11, name: 'Salmão', quantity: '150g', calories: 250, protein: 30, carbs: 0, fat: 15 },
          { id: 12, name: 'Batata Doce', quantity: '150g', calories: 130, protein: 2, carbs: 30, fat: 0 },
          { id: 13, name: 'Salada Verde', quantity: '100g', calories: 20, protein: 2, carbs: 4, fat: 0 },
        ]
      },
    ]
  }

  if (loading) {
    return (
      <div className="client-page-layout">
        <ClientSidebar />
        <div className="client-main-content">
          <div className="dieta-container">
            <h1>🍽️ Minha Dieta</h1>
            <p>Carregando dados...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="client-page-layout">
        <ClientSidebar />
        <div className="client-main-content">
          <div className="dieta-container">
            <h1>🍽️ Minha Dieta</h1>
            <p style={{color: 'red'}}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const mealToShow = selectedMeal || currentDietPlan.meals[0].name
  const selectedMealData = currentDietPlan.meals.find(m => m.name === mealToShow)

  const totalMacros = selectedMealData.foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <div className="client-page-layout">
      <ClientSidebar />
      <div className="client-main-content">
        <div className="dieta-container">
          <div className="dieta-header">
            <h1>🍽️ Minha Dieta</h1>
            <p>{currentDietPlan.planName}</p>
            <p className="client-name">Cliente: {clienteInfo.nome}</p>
            <p>Período: {currentDietPlan.startDate} - {currentDietPlan.endDate}</p>
          </div>

          <div className="dieta-content">
            <div className="meal-selector">
              {currentDietPlan.meals.map(meal => (
                <button
                  key={meal.name}
                  className={`meal-button ${mealToShow === meal.name ? 'active' : ''}`}
                  onClick={() => setSelectedMeal(meal.name)}
                >
                  {meal.name} ({meal.time})
                </button>
              ))}
            </div>

            <div className="meal-details">
              <h2>{selectedMealData.name}</h2>
              <div className="foods-list">
                {selectedMealData.foods.map(food => (
                  <div key={food.id} className="food-item">
                    <div className="food-info">
                      <h3>{food.name}</h3>
                      <p>Quantidade: {food.quantity}</p>
                    </div>
                    <div className="food-macros">
                      <span>{food.calories} kcal</span>
                      <span>P: {food.protein}g</span>
                      <span>C: {food.carbs}g</span>
                      <span>G: {food.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="meal-total">
                <h3>Total da Refeição</h3>
                <div className="total-macros">
                  <span>Calorias: {totalMacros.calories} kcal</span>
                  <span>Proteína: {totalMacros.protein}g</span>
                  <span>Carboidratos: {totalMacros.carbs}g</span>
                  <span>Gordura: {totalMacros.fat}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}