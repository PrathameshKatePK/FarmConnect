import { useEffect, useState } from "react";
import {
  getSettings,
  updateSetting,
} from "../../api/settingsApi";

function Settings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSettings();

      if (response.success) {
        setSettings(response.data);
      } else {
        setError(response.message || "Failed to load settings");
      }
    } catch (err) {
      console.error("Settings error:", err);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, value) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? {
              ...setting,
              setting_value: value,
            }
          : setting
      )
    );
  };

  const handleSave = async (setting) => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await updateSetting(setting.id, {
        setting_key: setting.setting_key,
        setting_value: setting.setting_value,
        setting_type: setting.setting_type,
        description: setting.description,
      });

      if (response.success) {
        setMessage(
          `${formatLabel(setting.setting_key)} updated successfully.`
        );

        await fetchSettings();
      } else {
        setError(response.message || "Failed to update setting");
      }
    } catch (err) {
      console.error("Update setting error:", err);
      setError("Failed to update setting");
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key) => {
    return settings.find(
      (setting) => setting.setting_key === key
    );
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Manage FarmConnect platform settings.
        </p>
      </div>


      {/* Success Message */}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
          {message}
        </div>
      )}


      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}


      {/* General Settings */}
      <SettingsSection
        title="General Settings"
        description="Basic information about your FarmConnect marketplace."
      >

        <SettingField
          setting={getSetting("site_name")}
          onChange={handleChange}
          onSave={handleSave}
          saving={saving}
        />

        <SettingField
          setting={getSetting("site_description")}
          onChange={handleChange}
          onSave={handleSave}
          saving={saving}
          textarea
        />

        <SettingField
          setting={getSetting("default_language")}
          onChange={handleChange}
          onSave={handleSave}
          saving={saving}
          select
          options={[
            { value: "en", label: "English" },
            { value: "mr", label: "Marathi" },
            { value: "hi", label: "Hindi" },
          ]}
        />

      </SettingsSection>


      {/* Contact Settings */}
      <SettingsSection
        title="Contact Settings"
        description="Contact information displayed for the platform."
      >

        <SettingField
          setting={getSetting("contact_email")}
          onChange={handleChange}
          onSave={handleSave}
          saving={saving}
        />

        <SettingField
          setting={getSetting("contact_phone")}
          onChange={handleChange}
          onSave={handleSave}
          saving={saving}
        />

      </SettingsSection>


      {/* Marketplace Settings */}
      <SettingsSection
        title="Marketplace Settings"
        description="Configure basic marketplace behavior."
      >

        <SettingField
          setting={getSetting("currency")}
          onChange={handleChange}
          onSave={handleSave}
          saving={saving}
        />

        <SettingField
          setting={getSetting("orders_enabled")}
          onChange={handleChange}
          onSave={handleSave}
          saving={saving}
          boolean
        />

      </SettingsSection>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Settings Section
|--------------------------------------------------------------------------
*/

function SettingsSection({
  title,
  description,
  children,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border">

      <div className="p-5 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>
      </div>

      <div className="p-5 space-y-5">
        {children}
      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Setting Field
|--------------------------------------------------------------------------
*/

function SettingField({
  setting,
  onChange,
  onSave,
  saving,
  textarea = false,
  select = false,
  options = [],
  boolean = false,
}) {
  if (!setting) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">

      <div className="lg:w-1/3">

        <label className="block font-medium text-gray-700">
          {formatLabel(setting.setting_key)}
        </label>

        {setting.description && (
          <p className="text-xs text-gray-500 mt-1">
            {setting.description}
          </p>
        )}

      </div>


      <div className="flex-1 flex gap-3">

        {boolean ? (
          <select
            value={setting.setting_value}
            onChange={(e) =>
              onChange(setting.id, e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        ) : select ? (
          <select
            value={setting.setting_value}
            onChange={(e) =>
              onChange(setting.id, e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : textarea ? (
          <textarea
            value={setting.setting_value || ""}
            onChange={(e) =>
              onChange(setting.id, e.target.value)
            }
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        ) : (
          <input
            type="text"
            value={setting.setting_value || ""}
            onChange={(e) =>
              onChange(setting.id, e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        )}

        <button
          onClick={() => onSave(setting)}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
        >
          {saving ? "Saving..." : "Save"}
        </button>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Format Setting Label
|--------------------------------------------------------------------------
*/

function formatLabel(key) {
  return key
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default Settings;