package com.coatilabs.weactive

import com.facebook.react.bridge.*
import io.conekta.conektasdk.Conekta
import io.conekta.conektasdk.Card
import io.conekta.conektasdk.Token
import org.json.JSONObject
import org.json.JSONArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.WritableMap
import org.json.JSONException
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableArray

class ConektaManager constructor(context: ReactApplicationContext) : ReactContextBaseJavaModule(context){

    override fun getName(): String {
        return "RNConekta"
    }

    @ReactMethod
    fun setPublicKey(key: String){
        Conekta.setPublicKey(key)
        try {
          Conekta.collectDevice(reactApplicationContext.currentActivity)
        }
        catch (e: Exception) {
          // Do nothing if fails
        }
    }

    @ReactMethod
    fun createToken(
            data: ReadableMap,
            success: Callback,
            failure: Callback
    ) {
        val card = Card(
            data.getString("name"),
            data.getString("cardNumber"),
            data.getString("cvc"),
            data.getString("expMonth"),
            data.getString("expYear")
        )
        val token = Token(reactApplicationContext.currentActivity)
        token.onCreateTokenListener{data: JSONObject ->
            try {
                success(convertJsonToMap(data))
            } catch (err: Exception) {
                failure(err.message)
            }
        }
        token.create(card)
    }

    @Throws(JSONException::class)
    private fun convertJsonToMap(jsonObject: JSONObject): WritableMap {
        val map = WritableNativeMap()

        val iterator = jsonObject.keys()
        while (iterator.hasNext()) {
            val key = iterator.next()
            val value = jsonObject.get(key)
            if (value is JSONObject) {
                map.putMap(key, convertJsonToMap(value))
            } else if (value is JSONArray) {
                map.putArray(key, convertJsonToArray(value))
            } else if (value is Boolean) {
                map.putBoolean(key, value)
            } else if (value is Int) {
                map.putInt(key, value)
            } else if (value is Double) {
                map.putDouble(key, value)
            } else if (value is String) {
                map.putString(key, value)
            } else {
                map.putString(key, value.toString())
            }
        }
        return map
    }

    @Throws(JSONException::class)
    private fun convertJsonToArray(jsonArray: JSONArray): WritableArray {
        val array = WritableNativeArray()

        for (i in 0 until jsonArray.length()) {
            val value = jsonArray.get(i)
            if (value is JSONObject) {
                array.pushMap(convertJsonToMap(value))
            } else if (value is JSONArray) {
                array.pushArray(convertJsonToArray(value))
            } else if (value is Boolean) {
                array.pushBoolean(value)
            } else if (value is Int) {
                array.pushInt(value)
            } else if (value is Double) {
                array.pushDouble(value)
            } else if (value is String) {
                array.pushString(value)
            } else {
                array.pushString(value.toString())
            }
        }
        return array
    }

}