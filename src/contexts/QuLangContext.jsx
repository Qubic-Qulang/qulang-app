"use client"

import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import {
    buildTopUpTx,
    buildWithdrawTx,
    buildUpdateProviderTx,
    buildProcessRequestTx,
    fetchUserBalance
} from '@/lib/QuLang'
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper'
import { TICK_OFFSET, useConfig } from './ConfigContext'
import { useQubicConnect } from './QubicConnectContext'

const QuLangContext = createContext()

const initialState = {
    data: { balance: 0n },
    loading: false,
    error: null,
}

function hm25Reducer(state, action) {
    switch (action.type) {
        case 'SET_QULANG_DATA':
            return { ...state, data: action.payload }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload }
        default:
            return state
    }
}

export const HM25Provider = ({ children }) => {
    const [state, dispatch] = useReducer(hm25Reducer, initialState)
    const { httpEndpoint } = useConfig()
    const { wallet, connected, getTick, broadcastTx, signTransaction } = useQubicConnect()
    const [qHelper] = useState(() => new QubicHelper())
    const [balance, setBalance] = useState(null)
    const [walletPublicIdentity, setWalletPublicIdentity] = useState('')

    useEffect(() => {
        if (!httpEndpoint || !walletPublicIdentity) return
        const fetchQuLangBalance = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true })
                const quLangData = await fetchUserBalance(httpEndpoint, qHelper, walletPublicIdentity)
                dispatch({ type: 'SET_QULANG_DATA', payload: quLangData })
            } catch (err) {
                console.error(err)
                dispatch({ type: 'SET_ERROR', payload: 'Failed to load qulang balance' })
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false })
            }
        }
        fetchQuLangBalance() // Fetch immediately on mount or httpEndpoint change
        const intervalId = setInterval(fetchQuLangBalance, 5000) // Fetch every 5 seconds
        return () => clearInterval(intervalId) // Cleanup interval on unmount or httpEndpoint change
    }, [httpEndpoint, walletPublicIdentity])

    useEffect(() => {
        const initIdentityAndBalance = async () => {
            if (!wallet) {
                setWalletPublicIdentity('')
                setBalance(null)
                return
            }
            if (wallet.connectType === 'walletconnect' || wallet.connectType === 'mmSnap') {
                if (wallet.publicKey) {
                    setWalletPublicIdentity(wallet.publicKey)
                    fetchBalance(wallet.publicKey)
                }
                return
            }
            try {
                const idPackage = await qHelper.createIdPackage(wallet.privateKey || wallet)
                const identity = await qHelper.getIdentity(idPackage.publicKey)
                if (identity) {
                    setWalletPublicIdentity(identity)
                    fetchBalance(identity)
                }
            } catch (err) {
                console.error('Error initializing identity:', err)
            }
        }
        initIdentityAndBalance()
    }, [wallet])

    useEffect(() => {
        let intervalId
        if (walletPublicIdentity) {
            intervalId = setInterval(() => fetchBalance(walletPublicIdentity), 300000) // 5 minutes
        }
        return () => clearInterval(intervalId)
    }, [walletPublicIdentity])

    const fetchBalance = async (publicId) => {
        if (!httpEndpoint || !publicId) return
        try {
            const response = await fetch(`${httpEndpoint}/v1/balances/${publicId}`, {
                headers: { accept: 'application/json' },
            })
            const data = await response.json()
            setBalance(data.balance.balance)
        } catch (error) {
            console.error('Error fetching balance:', error)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch balance' })
        }
    }

    const topup = async (amount) => {
        if (!connected || !wallet) return
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            const tick = await getTick()
            const unsignedTx = await buildTopUpTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), tick, amount)
            const finalTx = await signTransaction(unsignedTx)
            const broadcastRes = await broadcastTx(finalTx)
            console.log('TopUp TX result:', broadcastRes)
            return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
        } catch (err) {
            console.error(err)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to top up coins' })
            throw err
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const withdraw = async (amount) => {
        if (!connected || !wallet) return
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            const tick = await getTick()
            const unsignedTx = await buildWithdrawTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), tick, amount)
            const finalTx = await signTransaction(unsignedTx)
            const broadcastRes = await broadcastTx(finalTx)
            console.log('Withdraw TX result:', broadcastRes)
            return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
        } catch (err) {
            console.error(err)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to withdraw coins' })
            throw err
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const updateProvider = async (priceInput, priceOutput, burnRate) => {
        if (!connected || !wallet) return
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            const tick = await getTick()
            const unsignedTx = await buildUpdateProviderTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), tick, priceInput, priceOutput, burnRate)
            const finalTx = await signTransaction(unsignedTx)
            const broadcastRes = await broadcastTx(finalTx)
            console.log('Update provider TX result:', broadcastRes)
            return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
        } catch (err) {
            console.error(err)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update provider' })
            throw err
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const processRequest = async (provider_id, user_id, priceOutput, token_input, token_output) => {
        if (!connected || !wallet) return
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            const tick = await getTick()
            const unsignedTx = await buildProcessRequestTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), tick, provider_id, user_id, token_input, token_output)
            const finalTx = await signTransaction(unsignedTx)
            const broadcastRes = await broadcastTx(finalTx)
            console.log('Process Request TX result:', broadcastRes)
            return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
        } catch (err) {
            console.error(err)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to process request' })
            throw err
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    return (
        <QuLangContext.Provider value={{ state, topup, withdraw, updateProvider, processRequest, balance, walletPublicIdentity, fetchBalance }}>
            {children}
        </QuLangContext.Provider>
    )
}

export const useQuLang = () => useContext(QuLangContext)
